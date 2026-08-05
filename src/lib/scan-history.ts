import type { AnalysisResult } from "@/lib/analyze.functions";

export type ScanRecord = {
  id: string;
  scannedAt: number;
  image: string;
  result: AnalysisResult;
};

const KEY = "labeltruth.history.v1";
const MAX = 25;

export function loadHistory(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScan(record: Omit<ScanRecord, "id" | "scannedAt">): ScanRecord[] {
  const next = [
    { ...record, id: crypto.randomUUID(), scannedAt: Date.now() },
    ...loadHistory(),
  ].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full — keep the in-memory list */
  }
  return next;
}

export function clearHistory(): ScanRecord[] {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return [];
}
