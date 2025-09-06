import express from "express";
import multer from "multer";
import pdf from "pdf-parse";
import { v4 as uuid } from "uuid";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

/** ---------- Reduced Topic Taxonomy (content-driven) ---------- */
const TOPIC_RULES = [
  { topic: "Definitions", kws: [" is a ", " defined as ", " refers to ", " are called "] },
  { topic: "Examples",    kws: ["for example", "e.g.", "such as"] },
  { topic: "Processes",   kws: ["process", "step", "first", "then", "finally", "workflow"] },
  { topic: "Lists",       kws: ["•", "-", "*", "include", "list", "the following"] },
  { topic: "Compare",     kws: [" vs ", " versus ", "compare", "difference", "similarities"] }
];

function classifyTopics(text) {
  const lc = text.toLowerCase();
  const scores = new Map();
  for (const { topic, kws } of TOPIC_RULES) {
    let s = 0; for (const k of kws) if (lc.includes(k)) s++;
    if (s > 0) scores.set(topic, s);
  }
  const top = [...scores.entries()].sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>t);
  return top.length ? top : ["Other"];
}

/** ---------- Chunking Heuristics ---------- */
function chunkIntoSections(fullText) {
  const raw = fullText.split(/\n\s*\n/);
  return raw
    .map(x => x.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((t) => ({ title: guessTitle(t), text: t, pageStart: 1, pageEnd: 1 }));
}
function guessTitle(text) {
  const m = text.match(/^([A-Z][A-Za-z0-9 \-]{3,50})[:\-]/);
  return m ? m[1] : undefined;
}

/** ---------- Card Generation Heuristics ---------- */
function summarize(t) {
  const s = t.split(". ")[0] || t.slice(0, 200);
  return s.length > 220 ? s.slice(0, 200) + "…" : s;
}

function toCardsFromSection(sec, pdfName) {
  const cards = [];
  const topics = classifyTopics(sec.text);

  // (1) Definition pattern
  const defMatch = sec.text.match(/([A-Za-z][A-Za-z0-9 \-]{3,40}) is (an?|the|a) [^\.]{10,200}\./);
  if (defMatch) {
    const term = defMatch[1];
    cards.push({
      id: uuid(),
      front: `Define: ${term}`,
      back: defMatch[0],
      topics,
      tags: [sec.title ?? "Untitled Section"],
      source: { pdfName, pageStart: sec.pageStart, pageEnd: sec.pageEnd },
      confidence: 0.7
    });
  }

  // (2) Bulleted list → enumeration recall
  const bullets = sec.text.match(/(\u2022|-|\*)\s+[^\n]+/g);
  if (bullets && bullets.length >= 3) {
    const title = sec.title || "Key points";
    cards.push({
      id: uuid(),
      front: `List the key points: ${title}`,
      back: bullets.map(b => b.replace(/^(\u2022|\-|\*)\s+/, "• ")).join("\n"),
      topics,
      tags: [title],
      source: { pdfName, pageStart: sec.pageStart, pageEnd: sec.pageEnd },
      confidence: 0.6
    });
  }

  // (3) Heading → "What is …?"
  if (sec.title) {
    cards.push({
      id: uuid(),
      front: `What is ${sec.title}?`,
      back: summarize(sec.text),
      topics,
      tags: [sec.title],
      source: { pdfName, pageStart: sec.pageStart, pageEnd: sec.pageEnd },
      confidence: 0.5
    });
  }

  return cards;
}

app.post("/ingest/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const pdfName = req.file.originalname;
    const data = await pdf(req.file.buffer);
    const sections = chunkIntoSections(data.text || "");
    const allCards = sections.flatMap((s) => toCardsFromSection(s, pdfName));
    res.json({ cards: allCards, meta: { pdfName, pages: data.numpages || 0, extractedAt: new Date().toISOString() } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

app.listen(4000, () => console.log("Ingest server listening on :4000"));