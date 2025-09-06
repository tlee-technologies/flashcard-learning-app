import { describe, it, expect } from "vitest";

// Mock topic classification tests
describe("Topic Classification", () => {
  const TOPIC_RULES = [
    { topic: "Definitions", kws: [" is a ", " defined as ", " refers to ", " are called "] },
    { topic: "Examples", kws: ["for example", "e.g.", "such as"] },
    { topic: "Processes", kws: ["process", "step", "first", "then", "finally", "workflow"] },
    { topic: "Lists", kws: ["•", "-", "*", "include", "list", "the following"] },
    { topic: "Compare", kws: [" vs ", " versus ", "compare", "difference", "similarities"] }
  ];

  function classifyTopics(text: string) {
    const lc = text.toLowerCase();
    const scores = new Map();
    for (const { topic, kws } of TOPIC_RULES) {
      let s = 0; 
      for (const k of kws) if (lc.includes(k)) s++;
      if (s > 0) scores.set(topic, s);
    }
    const top = [...scores.entries()].sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>t);
    return top.length ? top : ["Other"];
  }

  it("should classify definition text correctly", () => {
    const text = "A finite automaton is a mathematical model of computation.";
    const topics = classifyTopics(text);
    expect(topics).toContain("Definitions");
  });

  it("should classify example text correctly", () => {
    const text = "For example, a DFA can recognize binary strings ending in 01.";
    const topics = classifyTopics(text);
    expect(topics).toContain("Examples");
  });

  it("should classify process text correctly", () => {
    const text = "First, create the states. Then, define transitions. Finally, mark accept states.";
    const topics = classifyTopics(text);
    expect(topics).toContain("Processes");
  });

  it("should classify list text correctly", () => {
    const text = "The components include: • States • Alphabet • Transitions";
    const topics = classifyTopics(text);
    expect(topics).toContain("Lists");
  });

  it("should classify comparison text correctly", () => {
    const text = "DFA vs NFA: the main difference is determinism.";
    const topics = classifyTopics(text);
    expect(topics).toContain("Compare");
  });

  it("should return Other for unclassified text", () => {
    const text = "Random text with no keywords.";
    const topics = classifyTopics(text);
    expect(topics).toEqual(["Other"]);
  });
});