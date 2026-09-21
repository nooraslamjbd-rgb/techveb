import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getDirFromCategory } from "./category-utils";

export { getDirFromCategory };

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  imageCredit?: string;
  imageCreditUrl?: string;
  featured?: boolean;
  readingTime?: string;
  faq?: { question: string; answer: string }[];
  source?: string;
  sourceLink?: string;
  language?: string;
  keyTakeaways?: string[];
  products?: {
    name: string;
    description?: string;
    brand?: string;
    price?: string;
    priceCurrency?: string;
    ratingValue?: string;
    reviewCount?: string;
    bestRating?: string;
    image?: string;
    url?: string;
    position?: number;
  }[];
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  dir: string;
}

export function excerptFromContent(content: string, length = 160): string {
  const plain = (content || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|=\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > length ? `${plain.slice(0, length).trim()}…` : plain;
}

export function getPostDescription(
  post: Pick<Post, "description" | "content">
): string {
  const desc = (post.description || "").trim();
  if (desc) return desc;
  return excerptFromContent(post.content || "");
}

export function isJunkSlug(slug: string): boolean {
  return /^\d+(-\d+)*$/.test(slug);
}

const contentDir = path.join(process.cwd(), "src", "content");

function getFiles(dir: string): string[] {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function getFile(dir: string, slug: string): Post | null {
  const fullPath = path.join(contentDir, dir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return {
    slug,
    ...fm,
    dir,
    readingTime: `${minutes} min read`,
    content,
  };
}

function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function getAllPosts(dir: string): Post[] {
  const slugs = getFiles(dir);
  const posts = slugs
    .map((slug) => getFile(dir, slug))
    .filter((p): p is Post => p !== null)
    .filter((p) => (p as unknown as Record<string, unknown>).status !== "draft")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getAllPostsAdmin(dir: string): Post[] {
  const slugs = getFiles(dir);
  const posts = slugs
    .map((slug) => getFile(dir, slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPost(dir: string, slug: string): Post | null {
  return getFile(dir, slug);
}

export function getFeaturedPosts(dir: string): Post[] {
  return getAllPosts(dir).filter((p) => p.featured);
}

export function getPostsByCategory(dir: string, category: string): Post[] {
  return getAllPosts(dir).filter((p) => p.category === category);
}

export function getPostsByTag(dir: string, tag: string): Post[] {
  return getAllPosts(dir).filter((p) => p.tags.includes(tag));
}

export function getAllTags(dir: string): { tag: string; count: number }[] {
  const posts = getAllPosts(dir);
  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function generateExcerpt(content: string, maxLength = 160): string {
  const plain = content
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_`~\[\]()>]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > maxLength
    ? plain.substring(0, maxLength).trim() + "..."
    : plain;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAllPostsFromAllDirs(): Post[] {
  const dirs = ["blog", "reviews", "ai-tools", "news"];
  return dirs.flatMap((dir) => getAllPosts(dir));
}

export function getAllNewsPosts(): Post[] {
  return getAllPosts("news");
}

export function getNewsPost(slug: string): Post | null {
  return getPost("news", slug);
}

export function getAllPostsFromAllDirsAdmin(): Post[] {
  const dirs = ["blog", "reviews", "ai-tools"];
  return dirs.flatMap((dir) => getAllPostsAdmin(dir));
}

export function getAllCategories(dir: string): { category: string; count: number }[] {
  const posts = getAllPosts(dir);
  const catMap = new Map<string, number>();
  posts.forEach((post) => {
    catMap.set(post.category, (catMap.get(post.category) || 0) + 1);
  });
  return Array.from(catMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
