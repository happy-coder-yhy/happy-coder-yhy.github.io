/**
 * File writer.
 *
 * Writes generated markdown summaries to the daily-papers directory.
 * Checks for existing files to avoid duplicates.
 */

import { writeFile, mkdir, access } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import config from './config.js';
import { slugify } from './generator.js';

/**
 * Write a Chinese paper summary to disk.
 *
 * @param {object} paper - Paper metadata
 * @param {string} content - Generated markdown content
 * @returns {Promise<{filePath: string, isNew: boolean}>}
 */
export async function writePaperZh(paper, content) {
  const slug = slugify(paper.title.replace(/[^a-zA-Z0-9\s-]/g, ''));
  const filename = `${slug}.zh.md`;
  const filePath = join(config.outputDir, filename);

  return writeIfNew(filePath, content, paper);
}

/**
 * Write an English paper summary to disk.
 *
 * @param {object} paper - Paper metadata
 * @param {string} content - Generated markdown content
 * @returns {Promise<{filePath: string, isNew: boolean}|null>}
 */
export async function writePaperEn(paper, content) {
  if (!content) return null;

  const slug = slugify(paper.title.replace(/[^a-zA-Z0-9\s-]/g, ''));
  const filename = `${slug}.en.md`;
  const filePath = join(config.outputDir, filename);

  return writeIfNew(filePath, content, paper);
}

/**
 * Write content to filePath only if it doesn't already exist.
 */
async function writeIfNew(filePath, content, paper) {
  // Ensure output directory exists
  await mkdir(config.outputDir, { recursive: true });

  // Check if file already exists
  try {
    await access(filePath, constants.F_OK);
    console.log(`   ⏭️  Already exists, skipping: ${filePath}`);
    return { filePath, isNew: false };
  } catch (_) {
    // File doesn't exist — proceed
  }

  await writeFile(filePath, content, 'utf-8');
  console.log(`   ✅ Written: ${filePath}`);
  return { filePath, isNew: true };
}
