import Fuse from "fuse.js";
import { useEffect, useRef, useState, useMemo, type ChangeEvent } from "react";
import Card from "@components/Card";
import type { CollectionEntry } from "astro:content";

export type SearchItem = {
  title: string;
  description: string;
  data: CollectionEntry<"blog">["data"];
  slug: string;
};

interface Props {
  searchJson: string;
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function SearchBar({ searchJson }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  // JSON 字符串 → 解析为数组，绕过 Astro props 序列化
  const searchList: SearchItem[] = useMemo(() => {
    try {
      return JSON.parse(searchJson);
    } catch {
      return [];
    }
  }, [searchJson]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const fuse = useMemo(() => {
    if (!searchList || searchList.length === 0) return null;
    return new Fuse(searchList, {
      keys: ["title", "description"],
      includeMatches: false,
      minMatchCharLength: 1,
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [searchList]);

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    const cursorTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          searchStr?.length || 0;
      }
    }, 50);

    return () => clearTimeout(cursorTimer);
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (!fuse || inputVal.length === 0) {
        setSearchResults(null);
        return;
      }
      try {
        const results = fuse.search(inputVal);
        setSearchResults(results as SearchResult[]);
      } catch {
        setSearchResults(null);
      }

      if (inputVal.length > 0) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("q", inputVal);
        const newRelativePathQuery =
          window.location.pathname + "?" + searchParams.toString();
        history.replaceState(history.state, "", newRelativePathQuery);
      } else {
        history.replaceState(history.state, "", window.location.pathname);
      }
    }, 200);

    return () => clearTimeout(debounceTimer.current);
  }, [inputVal, fuse]);

  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
<<<<<<< HEAD
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
=======
<<<<<<< HEAD
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
=======
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
>>>>>>> 072c788e5503383ba5132853f2a55c7c5017c71f
>>>>>>> c8c1359b3937aaaabc9ad37efcd5b4dec965eb46
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
          <span className="sr-only">搜索</span>
        </span>
        <input
          className="block w-full rounded border border-skin-line bg-skin-fill py-3 pl-10 pr-3 placeholder:italic placeholder:text-skin-base/35 focus:border-skin-accent focus:outline-none"
          placeholder="输入关键词搜索文章..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
      </label>

      {searchList.length === 0 && (
        <p className="mt-6 text-center text-skin-base/60">暂无文章数据，搜索不可用。</p>
      )}

      {inputVal.length > 0 && searchResults !== null && (
        <div className="mt-8">
          找到 {searchResults.length} 条与「{inputVal}」相关的结果
        </div>
      )}

      {inputVal.length > 0 && searchResults !== null && searchResults.length === 0 && (
        <p className="mt-4 text-center text-skin-base/60">没有找到匹配的文章，试试换个关键词吧。</p>
      )}

      <ul>
        {searchResults &&
          searchResults.map(({ item, refIndex }) => (
            <Card
              href={`/posts/${item.slug}/`}
              frontmatter={item.data}
              key={`${refIndex}-${item.slug}`}
            />
          ))}
      </ul>
    </>
  );
}
