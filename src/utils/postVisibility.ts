import type { CollectionEntry } from "astro:content";
import { SITE } from "@config";

/** 草稿永不公开；生产构建还会隐藏尚未到发布时间或仍在宽限期内的文章。 */
const postFilter = ({ data }: CollectionEntry<"blog">) => {
  return (
    !data.draft &&
    (import.meta.env.DEV ||
      data.pubDatetime.valueOf() <= Date.now() + SITE.scheduledPostMargin)
  );
};

export default postFilter;
