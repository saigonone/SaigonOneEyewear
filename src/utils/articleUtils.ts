import { Article } from "../types";

/**
 * Robust parser for article dates in various formats:
 * - DD/MM/YYYY or DD-MM-YYYY (e.g. "25/08/2026", "8/9/2026")
 * - YYYY-MM-DD or ISO 8601 (e.g. "2026-09-08T12:00:00.000Z")
 * - Unix timestamp in ms or seconds
 * - Fallback to ID timestamp if ID contains Date.now() digits
 */
export function parseArticleDate(dateStr?: string | number | null): number {
  if (!dateStr) return 0;

  if (typeof dateStr === "number") {
    return dateStr > 10000000000 ? dateStr : dateStr * 1000;
  }

  const str = String(dateStr).trim();
  if (!str) return 0;

  // Pure numeric string
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    return num > 10000000000 ? num : num * 1000;
  }

  // DD/MM/YYYY or DD-MM-YYYY (with optional time)
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const hour = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
    const minute = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
    const second = dmyMatch[6] ? parseInt(dmyMatch[6], 10) : 0;
    return new Date(year, month, day, hour, minute, second).getTime();
  }

  // Standard Date.parse for ISO or US format
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) {
    return parsed;
  }

  return 0;
}

/**
 * Gets the most reliable timestamp for an article (publishedAt, createdAt, updatedAt, or ID)
 */
export function getArticleTimestamp(art: Article): number {
  if (!art) return 0;

  // 1. Try publishedAt
  if (art.publishedAt) {
    const time = parseArticleDate(art.publishedAt);
    if (time > 0) return time;
  }

  // 2. Try createdAt / updatedAt
  const createdAt = (art as any).createdAt;
  if (createdAt) {
    const time = parseArticleDate(createdAt);
    if (time > 0) return time;
  }

  const updatedAt = (art as any).updatedAt;
  if (updatedAt) {
    const time = parseArticleDate(updatedAt);
    if (time > 0) return time;
  }

  // 3. Try parsing ID if generated via Date.now() (e.g. art-178892...)
  if (art.id) {
    const match = art.id.match(/\d{10,13}/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > 10000000000) return num;
    }
  }

  return 0;
}

/**
 * Sorts articles strictly from newest to oldest
 */
export function sortArticlesByNewest(articles: Article[]): Article[] {
  if (!Array.isArray(articles)) return [];
  return [...articles].sort((a, b) => {
    const timeB = getArticleTimestamp(b);
    const timeA = getArticleTimestamp(a);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    // Secondary tie-breaker: compare ID
    return (b.id || "").localeCompare(a.id || "");
  });
}
