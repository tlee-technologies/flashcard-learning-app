import type { IngestResponse } from "@/types/ingest";

export async function ingestPdf(file: { name: string; uri: string; mimeType?: string }): Promise<IngestResponse> {
  const form = new FormData();
  form.append("file", { uri: file.uri, name: file.name, type: file.mimeType ?? "application/pdf" } as any);
  const base = process.env.EXPO_PUBLIC_INGEST_URL ?? "http://localhost:4000";
  const r = await fetch(`${base}/ingest/pdf`, { method: "POST", body: form, headers: { "Accept": "application/json" } });
  if (!r.ok) throw new Error(`Ingest failed (${r.status})`);
  return r.json();
}