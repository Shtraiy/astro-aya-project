import type { CollectionEntry } from "astro:content";
import postFilter from "./postVisibility";
import normalizePostDatetimes from "./normalizePostDatetimes";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .map(normalizePostDatetimes)
    .filter(postFilter)
    .sort(
      (a, b) =>
        new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() -
        new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime()
    );
};

export default getSortedPosts;
