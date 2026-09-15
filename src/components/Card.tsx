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
  /** 阅读时长；不传则按正文现算 */
  readingTime?: string;
  /** 卡片正文，用于现算阅读时长 */
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

  /* 栏目色相取自 src/data/categories.ts，和筛选条、栏目页保持同一个颜色 */
  const categoryHue = getCategory(category)?.hue ?? 220;

  const minutes = readingTime ?? (body ? getReadingTime(body) : undefined);

  // 标题参与列表 / 详情页之间的视图过渡，name 必须保持一致
  const titleStyle = { viewTransitionName: slugifyStr(title) };
  const titleClass =
    "mt-1 text-lg font-medium transition-colors duration-200 group-hover/card:text-primary";

  return (
    <li
      className="group/card bg-background hover:bg-muted border-border my-4 rounded-2xl border px-5 py-4 transition-colors duration-200"
      data-post-category={category}
    >
      <a href={href} className="flex flex-col no-underline">
        <div className="text-muted-foreground flex items-center justify-between gap-3 text-xs">
          <Datetime
            pubDatetime={pubDatetime}
            modDatetime={modDatetime}
            dateOnly
          />
          {/* 箭头：hover 时从右侧滑入，和参考主题一致 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="stroke-muted-foreground group-hover/card:stroke-primary h-4 w-4 shrink-0 transition-colors"
          >
            <line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              className="translate-x-4 scale-x-0 transition-transform duration-300 ease-in-out group-hover/card:translate-x-1 group-hover/card:scale-x-100"
            />
            <polyline
              points="12 5 19 12 12 19"
              className="translate-x-0 transition-transform duration-300 ease-in-out group-hover/card:translate-x-1"
            />
          </svg>
        </div>

        {secHeading ? (
          <h2 style={titleStyle} className={titleClass}>
            {title}
          </h2>
        ) : (
          <h3 style={titleStyle} className={titleClass}>
            {title}
          </h3>
        )}

        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
          {description}
        </p>

        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {minutes && (
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-3.5 w-3.5 fill-none"
              >
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M12 7v5l3 3" />
              </svg>
              <span>{minutes}</span>
            </span>
          )}
        </div>
      </a>

      {/* 栏目在前、标签在后：一眼能看出这条属于哪个栏目、讲了哪些关键词 */}
      <ul className="mt-2 flex list-none flex-wrap gap-1.5 p-0">
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
