import fs from 'node:fs';
import path from 'node:path';

const sizeCache = new Map<string, string>();

function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size <= 0) {
    return '';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  const exponent = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / Math.pow(1024, exponent);
  const formatted =
    value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1);

  return `${formatted} ${units[exponent]}`;
}

/**
 * Returns a human-readable file size string for a file under /public.
 * Falls back to null if the asset is missing or cannot be read at build time.
 */
export function getPublicFileSize(urlPath: string): string | null {
  const normalized = urlPath.replace(/^\/+/, '');

  if (!normalized) {
    return null;
  }

  if (sizeCache.has(normalized)) {
    return sizeCache.get(normalized) ?? null;
  }

  const absolutePath = path.join(process.cwd(), 'public', normalized);

  try {
    const stats = fs.statSync(absolutePath);
    const sizeLabel = formatBytes(stats.size);
    sizeCache.set(normalized, sizeLabel);
    return sizeLabel || null;
  } catch {
    sizeCache.set(normalized, '');
    return null;
  }
}
