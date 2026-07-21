import { z } from 'zod';

/**
 * Blog post categories
 */
export const BlogCategoryEnum = z.enum([
  'research',      // 我的研究论文
  'daily-papers',  // AI自动推送的论文
  'tutorials',     // 技术教程
  'notes',         // 学习笔记
  'others'         // 杂项
]);
export type BlogCategory = z.infer<typeof BlogCategoryEnum>;

/**
 * Publication status for research papers
 */
export const PublicationStatusEnum = z.enum(['published', 'under-review', 'preprint', 'workshop']);
export type PublicationStatus = z.infer<typeof PublicationStatusEnum>;

/**
 * Author information
 */
export const AuthorSchema = z.object({
  name: z.string(),
  affiliation: z.string().optional(),
  url: z.string().url().optional()
});
export type Author = z.infer<typeof AuthorSchema>;

/**
 * Extended frontmatter schema for blog posts
 * Supports regular posts, research papers, and tutorials
 */
export const BlogFrontmatterSchema = z.object({
  // Basic metadata (required for all posts)
  title: z.string().min(1, 'Title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  summary: z.string().min(1, 'Summary is required'),
  tags: z.array(z.string()).default([]),

  // Category and type
  category: BlogCategoryEnum.default('notes'),

  // Research paper specific fields (optional)
  venue: z.string().optional(), // e.g., "CVPR 2025", "NeurIPS 2024"
  status: PublicationStatusEnum.optional(),
  authors: z.array(AuthorSchema).optional(),

  // Links (optional)
  arxiv: z.string().url().optional(),
  pdf: z.string().optional(), // Path to PDF file
  github: z.string().url().optional(),
  project_page: z.string().url().optional(),
  doi: z.string().optional(),

  // Additional metadata
  year: z.number().int().min(2000).max(2100).optional(),
  area: z.string().optional(), // Research area, e.g., "multimodal-learning"
  citation_count: z.number().int().min(0).default(0),

  // BibTeX (for easy citation)
  bibtex: z.string().optional()
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

/**
 * Full blog post with content
 */
export interface BlogPost extends BlogFrontmatter {
  slug: string;
  content: string;
  locale: 'zh' | 'en';
  category: BlogCategory;
  readingTime?: number; // Estimated reading time in minutes
}

/**
 * Blog post metadata (without content)
 */
export interface BlogPostMetadata extends Omit<BlogPost, 'content'> {
  // All fields from BlogPost except content
}

/**
 * Filter options for blog posts
 */
export interface BlogFilterOptions {
  category?: BlogCategory;
  tags?: string[];
  year?: number;
  venue?: string;
  area?: string;
  status?: PublicationStatus;
  search?: string; // Search in title and summary
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  perPage?: number;
}

/**
 * Paginated results
 */
export interface PaginatedResults<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Sort options for blog posts
 */
export type BlogSortOption = 'date-desc' | 'date-asc' | 'citations' | 'title';

/**
 * Blog listing options (combines filtering, pagination, and sorting)
 */
export interface BlogListingOptions {
  filters?: BlogFilterOptions;
  pagination?: PaginationOptions;
  sort?: BlogSortOption;
}
