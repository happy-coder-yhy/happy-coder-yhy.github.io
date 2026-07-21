import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type {
  BlogPost,
  BlogPostMetadata,
  BlogFrontmatter,
  BlogCategory,
  BlogFilterOptions,
  PaginationOptions,
  PaginatedResults,
  BlogSortOption,
  BlogListingOptions
} from '@/types/blog';
import { BlogFrontmatterSchema } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'src/content/blog/posts');

/**
 * Calculate estimated reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Recursively get all markdown files in a directory
 */
function getMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Extract category from file path
 */
function getCategoryFromPath(filePath: string): BlogCategory {
  const relativePath = path.relative(postsDirectory, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length > 1) {
    const category = parts[0];
    if (['research', 'daily-papers', 'tutorials', 'notes', 'others'].includes(category)) {
      return category as BlogCategory;
    }
  }

  return 'others'; // Default category
}

/**
 * Parse and validate a blog post file
 */
function parsePostFile(filePath: string, locale: 'zh' | 'en'): BlogPostMetadata | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Get category from file path
    const category = getCategoryFromPath(filePath);

    // Add category to frontmatter data
    const frontmatterWithCategory = {
      ...data,
      category
    };

    // Validate frontmatter
    const validatedData = BlogFrontmatterSchema.parse(frontmatterWithCategory);

    // Extract slug from filename
    const fileName = path.basename(filePath);
    const slug = fileName.replace(`.${locale}.md`, '');

    return {
      ...validatedData,
      slug,
      locale,
      readingTime: calculateReadingTime(content)
    };
  } catch (error) {
    console.error(`Error parsing post file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all blog posts for a specific locale
 */
export function getAllPosts(locale: 'zh' | 'en'): BlogPostMetadata[] {
  const allFiles = getMarkdownFiles(postsDirectory);
  const posts = allFiles
    .filter((filePath) => filePath.endsWith(`.${locale}.md`))
    .map((filePath) => parsePostFile(filePath, locale))
    .filter((post): post is BlogPostMetadata => post !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // Sort by date descending

  return posts;
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: BlogCategory, locale: 'zh' | 'en'): BlogPostMetadata[] {
  return getAllPosts(locale).filter((post) => post.category === category);
}

/**
 * Apply filters to posts
 */
function applyFilters(posts: BlogPostMetadata[], filters: BlogFilterOptions): BlogPostMetadata[] {
  let filtered = [...posts];

  if (filters.category) {
    filtered = filtered.filter((post) => post.category === filters.category);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((post) =>
      filters.tags!.some((tag) => post.tags.includes(tag))
    );
  }

  if (filters.year) {
    filtered = filtered.filter((post) => post.date.startsWith(String(filters.year)));
  }

  if (filters.venue) {
    filtered = filtered.filter((post) => post.venue?.toLowerCase().includes(filters.venue!.toLowerCase()));
  }

  if (filters.area) {
    filtered = filtered.filter((post) => post.area === filters.area);
  }

  if (filters.status) {
    filtered = filtered.filter((post) => post.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.summary.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

/**
 * Apply sorting to posts
 */
function applySorting(posts: BlogPostMetadata[], sort: BlogSortOption): BlogPostMetadata[] {
  const sorted = [...posts];

  switch (sort) {
    case 'date-desc':
      return sorted.sort((a, b) => (a.date > b.date ? -1 : 1));
    case 'date-asc':
      return sorted.sort((a, b) => (a.date < b.date ? -1 : 1));
    case 'citations':
      return sorted.sort((a, b) => (b.citation_count || 0) - (a.citation_count || 0));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

/**
 * Get paginated and filtered posts
 */
export function getFilteredPosts(
  locale: 'zh' | 'en',
  options: BlogListingOptions = {}
): PaginatedResults<BlogPostMetadata> {
  let posts = getAllPosts(locale);

  // Apply filters
  if (options.filters) {
    posts = applyFilters(posts, options.filters);
  }

  // Apply sorting
  if (options.sort) {
    posts = applySorting(posts, options.sort);
  }

  // Apply pagination
  const page = options.pagination?.page || 1;
  const perPage = options.pagination?.perPage || 10;
  const total = posts.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = posts.slice(start, end);

  return {
    items,
    total,
    page,
    perPage,
    totalPages
  };
}

/**
 * Get a single blog post by slug and locale
 */
export function getPostBySlug(slug: string, locale: 'zh' | 'en'): BlogPost | null {
  try {
    const allFiles = getMarkdownFiles(postsDirectory);
    const filePath = allFiles.find((f) => f.endsWith(`${slug}.${locale}.md`));

    if (!filePath) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Get category from file path
    const category = getCategoryFromPath(filePath);

    // Add category to frontmatter data
    const frontmatterWithCategory = {
      ...data,
      category
    };

    // Validate frontmatter
    const validatedData = BlogFrontmatterSchema.parse(frontmatterWithCategory);

    return {
      ...validatedData,
      slug,
      content,
      locale,
      readingTime: calculateReadingTime(content)
    };
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all post slugs (for static generation)
 */
export function getAllPostSlugs(): string[] {
  const allFiles = getMarkdownFiles(postsDirectory);
  const slugs = new Set<string>();

  allFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    if (fileName.endsWith('.md')) {
      const slug = fileName.replace(/\.(zh|en)\.md$/, '');
      slugs.add(slug);
    }
  });

  return Array.from(slugs);
}

/**
 * Get all unique tags across all posts
 */
export function getAllTags(locale: 'zh' | 'en'): string[] {
  const posts = getAllPosts(locale);
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Get all unique years from posts
 */
export function getAllYears(locale: 'zh' | 'en'): number[] {
  const posts = getAllPosts(locale);
  const years = new Set<number>();

  posts.forEach((post) => {
    const year = parseInt(post.date.split('-')[0]);
    years.add(year);
  });

  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Get all unique venues from research papers and AI curated papers
 */
export function getAllVenues(locale: 'zh' | 'en'): string[] {
  const allPosts = getAllPosts(locale);
  const venues = new Set<string>();

  // Get venues from both research and daily-papers categories
  allPosts
    .filter((post) => post.category === 'research' || post.category === 'daily-papers')
    .forEach((post) => {
      if (post.venue) {
        venues.add(post.venue);
      }
    });

  return Array.from(venues).sort();
}

/**
 * Get recent posts (for homepage)
 */
export function getRecentPosts(locale: 'zh' | 'en', limit: number = 3): BlogPostMetadata[] {
  return getAllPosts(locale).slice(0, limit);
}

/**
 * Get related posts based on tags
 */
export function getRelatedPosts(
  currentSlug: string,
  locale: 'zh' | 'en',
  limit: number = 3
): BlogPostMetadata[] {
  const allPosts = getAllPosts(locale);
  const currentPost = allPosts.find((p) => p.slug === currentSlug);

  if (!currentPost) {
    return [];
  }

  // Calculate relevance score based on shared tags
  const postsWithScores = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
      return {
        post,
        score: sharedTags.length
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return postsWithScores.slice(0, limit).map((item) => item.post);
}
