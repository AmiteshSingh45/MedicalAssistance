import { ParsedSource } from '@/types';

/**
 * Generate a unique ID for messages
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Parse a source string like "filename.pdf (Page 3)" into structured parts
 */
export function parseSource(raw: string): ParsedSource {
  const match = raw.match(/^(.+?)\s*\(Page\s*([^)]+)\)$/i);
  if (match) {
    return {
      filename: match[1].trim(),
      page: match[2].trim(),
      raw,
    };
  }
  return { filename: raw, page: 'Unknown', raw };
}

/**
 * Format file size in human-readable form
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format a timestamp to a short readable time
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Clamp a string to a max length
 */
export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}
