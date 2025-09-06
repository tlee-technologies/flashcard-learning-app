export type Topic = "Definitions" | "Examples" | "Processes" | "Lists" | "Compare" | "Other";

export interface RawSection {
  title?: string;
  text: string;
  pageStart: number;
  pageEnd: number;
}

export interface GeneratedCard {
  id: string;
  front: string;
  back: string;
  topics: Topic[];     // primary categories
  tags: string[];      // contextual labels (e.g., "Chapter 4", "Physics")
  source: { pdfName: string; pageStart: number; pageEnd: number };
  confidence: number;  // 0..1
}

export interface IngestResponse {
  cards: GeneratedCard[];
  meta: { pdfName: string; pages: number; extractedAt: string; errors?: string[] };
}