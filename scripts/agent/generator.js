/**
 * Markdown generator.
 *
 * Post-processes and validates AI-generated summaries, ensuring correct
 * frontmatter and filename conventions.
 */

/**
 * Generate a URL-safe slug from a paper title.
 *
 * @param {string} title - Paper title
 * @returns {string} kebab-case slug
 */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿\s-]/g, '') // keep alphanumeric, Chinese, spaces, hyphens
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80); // reasonable max length
}

/**
 * Validate and fix frontmatter in a generated markdown file.
 *
 * @param {string} rawContent - Raw markdown from AI
 * @returns {{content: string, frontmatter: object|null}}
 */
export function validateAndFix(rawContent) {
  // Check for frontmatter delimiters
  const fmMatch = rawContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

  if (!fmMatch) {
    console.warn('   ⚠️  No valid frontmatter found in generated content');
    return { content: rawContent, frontmatter: null };
  }

  const fmText = fmMatch[1];
  const body = fmMatch[2];

  // Parse YAML frontmatter (simple approach)
  const frontmatter = {};
  for (const line of fmText.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      const key = m[1];
      let value = m[2].trim();

      // Remove surrounding quotes
      if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }

      // Parse array values: ['a', 'b']
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
      }

      frontmatter[key] = value;
    }
  }

  return { content: rawContent, frontmatter };
}

/**
 * Extract the title from frontmatter or raw content.
 */
export function extractTitle(rawContent) {
  const fmMatch = rawContent.match(/^---\s*\n[\s\S]*?title:\s*['"]?([^'"\n]+)/);
  if (fmMatch) return fmMatch[1].trim();

  // Fallback: first h1
  const h1Match = rawContent.match(/^#\s+(.+)/m);
  return h1Match ? h1Match[1].trim() : 'untitled';
}
