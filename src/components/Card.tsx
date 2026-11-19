import { slugifyStr } from "@utils/slugify";
import { getReadingTime } from "@utils/getReadingTime";
import { tagHue } from "@utils/tagHue";
import { getCategory } from "@data/categories";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
  readingTime?: string;
  body?: string;
}

export default function Card({
  href,
  frontmatter,
  secHeading = true,
  readingTime,
  body,
}: Props) {
  const { title, pubDatetime, modDatetime, description, tags, category } =
    frontmatter;
  const categoryHue = getCategory(category)?.hue ?? 220;
  const minutes = readingTime ?? (body ? getReadingTime(body) : undefined);
  const Heading = secHeading ? "h2" : "h3";

  return (
    <li
      className="border-b border-[color:var(--pixel-line)] py-4 sm:py-5"
      data-post-category={category}
    >
      <a href={href} className="group/post block">
        <div className="post-meta">
          <Datetime
            pubDatetime={pubDatetime}
            modDatetime={modDatetime}
            dateOnly
            className="opacity-100"
          />
          {minutes && <span>阅读约 {minutes}</span>}
        </div>
        <Heading
          style={{ viewTransitionName: slugifyStr(title) }}
          className="group-hover/post:text-primary group-focus-visible/post:text-primary mt-1 text-xl leading-snug font-semibold wrap-anywhere"
        >
          {title}
        </Heading>
        <p className="text-muted-foreground mt-1 line-clamp-2 max-w-[44em] text-sm wrap-anywhere">
          {description}
        </p>
      </a>

      <ul className="post-labels mt-2 flex list-none flex-wrap gap-1.5 p-0">
        <li>
          <a
            href={`/categories/${category}/`}
            className="chip chip--category"
            data-category-jump={category}
            style={{ "--cat-hue": categoryHue } as React.CSSProperties}
          >
            {category}
          </a>
        </li>
        {tags?.map(tag => (
          <li key={tag}>
            <a
              href={`/tags/${slugifyStr(tag)}/`}
              className="chip chip--tag"
              style={{ "--tag-hue": tagHue(tag) } as React.CSSProperties}
            >
              {tag}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
