/**
 * 博客工具函数：发布过滤、排序、阅读时间估算。
 * 阅读时间：中文按约 400 字/分钟，英文按约 200 词/分钟，取两者之和。
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/** 获取已发布文章（排除草稿），按发布日期倒序 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
}

/** 估算阅读时间（分钟），最少 1 分钟 */
export function getReadingTime(body: string): number {
  const chineseChars = (body.match(/[一-龥]/g) ?? []).length;
  const englishWords = (body.match(/[a-zA-Z]+/g) ?? []).length;
  const minutes = chineseChars / 400 + englishWords / 200;
  return Math.max(1, Math.round(minutes));
}

/** 从文章集合中提取全部标签（去重，按文章数排序） */
export function getAllTags(posts: BlogPost[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => map.set(tag, (map.get(tag) ?? 0) + 1));
  });
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** 格式化日期：2026-08-03 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
