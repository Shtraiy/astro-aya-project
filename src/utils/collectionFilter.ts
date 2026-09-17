import { loadLibrary, peekLibrary, type Library } from "@utils/musicLibrary";

/**
 * 收藏页的筛选控制器：艺术家药丸 + 关键词 + 排序。
 *
 * 为什么不再用共用的 `chipFilter`：那一版只做「一组按钮切互斥显隐」，而这页现在要同时管
 * 三件事（药丸、搜索框、排序），三者都得写同一批 `hidden` —— 两个 owner 抢一个属性必然互相踩。
 * 追番页仍用 `chipFilter`，它那边确实只需要互斥筛选。
 *
 * 数据分两层：专辑名 / 艺术家 / 年份 / 曲目数都来自卡片上的 `data-*`（构建期写好，不依赖网络），
 * 只有「曲名匹配」需要曲库 JSON；曲库没取到时搜索与排序照常工作，只是少一维。
 */

/** 卡片上带的字段（缺年份的用空串） */
type AlbumCard = HTMLElement & {
  dataset: DOMStringMap & {
    album: string;
    name: string;
    artist: string;
    artistName: string;
    year: string;
    songs: string;
  };
};

const normalize = (value: string) =>
  value.normalize("NFKC").toLowerCase().trim();

export function initCollectionFilter(): void {
  const grid = document.querySelector<HTMLElement>("[data-album-grid]");
  const input = document.querySelector<HTMLInputElement>("[data-album-search]");
  const clearButton = document.querySelector<HTMLButtonElement>(
    "[data-album-search-clear]"
  );
  const sortSelect =
    document.querySelector<HTMLSelectElement>("[data-album-sort]");
  const countEl = document.querySelector<HTMLElement>("[data-album-count]");
  const emptyEl = document.querySelector<HTMLElement>("[data-album-empty]");
  const resetButton =
    document.querySelector<HTMLButtonElement>("[data-album-reset]");
  const chips = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-artist-filter]")
  );
  const extraChips = Array.from(
    document.querySelectorAll<HTMLElement>("[data-artist-chip]")
  );
  const expandToggle = document.querySelector<HTMLButtonElement>(
    "[data-artist-toggle]"
  );

  if (!grid || !input) return;
  // 首次加载调一次、astro:page-load 又调一次，这里挡住重复绑定
  if (grid.dataset.filterReady === "true") return;
  grid.dataset.filterReady = "true";

  const cards = Array.from(grid.querySelectorAll<AlbumCard>("[data-album]"));
  /** 快照原本的顺序（默认排序就是它） */
  const original = [...cards];

  let artist = "all";
  let keyword = "";
  let sort = "default";
  let libraryRequested = false;

  /** 关键词命中的曲目（最多列两条） */
  const hitsOf = (card: AlbumCard): { id: string; title: string }[] => {
    if (!keyword) return [];
    const library: Library | null = peekLibrary();
    const album = library?.albums.find(item => item.id === card.dataset.album);
    if (!album) return [];
    return album.tracks
      .filter(track => normalize(track.title).includes(keyword))
      .slice(0, 2)
      .map(track => ({ id: track.id, title: track.title }));
  };

  /**
   * 曲名命中那一行：点它直接播这首（复用播放器的 data-album-open + data-album-track）。
   *
   * 这一行是脚本 createElement 出来的，拿不到 Astro 的作用域类，
   * 所以 `.album-hit` 的样式写在页面里并标了 :global（否则样式一条都不生效，
   * 那几个字会以正文的 1rem+ 字号糊在卡片下面）。
   * 歌名一律走 textContent，别让它当 HTML 解析。
   */
  const renderHits = (
    card: AlbumCard,
    hits: { id: string; title: string }[]
  ) => {
    const box = card.querySelector<HTMLElement>("[data-album-hits]");
    if (!box) return;
    const key = hits.map(hit => `${hit.id}:${hit.title}`).join("|");
    if (box.dataset.key === key) return;
    box.dataset.key = key;
    box.replaceChildren();
    box.hidden = hits.length === 0;
    for (const hit of hits) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "album-hit";
      button.dataset.albumOpen = card.dataset.album;
      button.dataset.albumTrack = hit.id;
      button.title = `播放《${hit.title}》`;
      button.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      const label = document.createElement("span");
      label.className = "album-hit-title";
      label.textContent = hit.title;
      button.append(label);
      box.append(button);
    }
  };

  const matches = (card: AlbumCard) => {
    if (artist !== "all" && card.dataset.artist !== artist) return false;
    if (!keyword) return true;
    if (normalize(card.dataset.name).includes(keyword)) return true;
    if (normalize(card.dataset.artistName).includes(keyword)) return true;
    return hitsOf(card).length > 0;
  };

  const compare = (a: AlbumCard, b: AlbumCard) => {
    const byName = () =>
      a.dataset.name.localeCompare(b.dataset.name, "zh") ||
      a.dataset.artistName.localeCompare(b.dataset.artistName, "zh");
    const byArtist = () =>
      a.dataset.artistName.localeCompare(b.dataset.artistName, "zh") ||
      byName();
    /** 缺年份的排最后 */
    const byYear = () =>
      Number(b.dataset.year || 0) - Number(a.dataset.year || 0) || byArtist();
    const bySongs = () =>
      Number(b.dataset.songs || 0) - Number(a.dataset.songs || 0) || byArtist();

    switch (sort) {
      case "name":
        return byName();
      case "artist":
        return byArtist();
      case "year":
        return byYear();
      case "songs":
        return bySongs();
      default:
        return original.indexOf(a) - original.indexOf(b);
    }
  };

  /** 排序也顺带把 DOM 重排了：卡片是静态渲染的，重排比按 order 属性改布局更省事 */
  const reorder = () => {
    const ordered = [...cards].sort(compare);
    for (const card of ordered) grid.append(card);
  };

  const apply = () => {
    let visible = 0;
    for (const card of cards) {
      const ok = matches(card);
      card.hidden = !ok;
      if (ok) visible += 1;
      renderHits(card, ok ? hitsOf(card) : []);
    }
    if (emptyEl) emptyEl.hidden = visible > 0 || cards.length === 0;
    if (countEl) {
      countEl.textContent =
        visible === cards.length ? "" : `显示 ${visible} / ${cards.length} 张`;
    }
    if (clearButton) clearButton.hidden = keyword.length === 0;
  };

  /** 曲名匹配要曲库：第一次输入关键词时才去要（播放器在收藏页通常已经预热好了） */
  const ensureLibrary = () => {
    if (peekLibrary() || libraryRequested) return;
    libraryRequested = true;
    void loadLibrary().then(library => {
      if (library && keyword) apply();
    });
  };

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      artist = chip.dataset.artistFilter ?? "all";
      for (const other of chips) {
        other.classList.toggle("is-current", other === chip);
      }
      apply();
    });
  }

  input.addEventListener("input", () => {
    keyword = normalize(input.value);
    ensureLibrary();
    apply();
  });
  input.addEventListener("search", () => {
    keyword = normalize(input.value);
    apply();
  });
  clearButton?.addEventListener("click", () => {
    input.value = "";
    keyword = "";
    apply();
    input.focus();
  });
  sortSelect?.addEventListener("change", () => {
    sort = sortSelect.value;
    reorder();
    apply();
  });
  resetButton?.addEventListener("click", () => {
    input.value = "";
    keyword = "";
    artist = "all";
    for (const chip of chips) {
      chip.classList.toggle("is-current", chip.dataset.artistFilter === "all");
    }
    apply();
  });

  // 「展开全部」：默认收起的那批艺术家药丸
  if (expandToggle) {
    const toggleLabel = expandToggle.textContent ?? "";
    expandToggle.addEventListener("click", () => {
      const expanded = expandToggle.getAttribute("aria-expanded") === "true";
      expandToggle.setAttribute("aria-expanded", String(!expanded));
      for (const chip of extraChips) chip.hidden = expanded;
      expandToggle.textContent = expanded ? toggleLabel : "收起";
    });
  }

  reorder();
  apply();
}
