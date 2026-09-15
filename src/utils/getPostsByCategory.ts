import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";

/**
 * 取某个分类下的文章。
 *
 * 排序与草稿过滤都交给 getSortedPosts（内部走 postFilter），
 * 保证分类页和首页、文章列表页看到的是同一套顺序。
 */
const getPostsByCategory = (
  posts: CollectionEntry<"blog">[],
  category: string
) => getSortedPosts(posts.filter(post => post.data.category === category));

export default getPostsByCategory;
