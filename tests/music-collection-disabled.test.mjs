import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = relativePath =>
  readFileSync(path.join(root, relativePath), "utf8");

test("music collection is removed from the public app", () => {
  assert.equal(existsSync(path.join(root, "src/pages/collection/index.astro")), false);
  assert.equal(existsSync(path.join(root, "src/pages/collection/data.json.ts")), false);
  assert.doesNotMatch(read("src/components/Header.astro"), /href="\/collection\//);
  assert.doesNotMatch(read("src/layouts/Layout.astro"), /MusicPlayer/);
});

test("the committed Navidrome snapshot does not expose playback credentials", () => {
  const snapshot = JSON.parse(read("src/data/navidrome.json"));
  assert.equal("stream" in snapshot, false);
});

test("image lightbox exposes an accessible close control", () => {
  const source = read("src/layouts/PostDetails.astro");
  assert.match(source, /document\.createElement\("button"\)/);
  assert.match(source, /closeBtn\.type = "button"/);
  assert.match(source, /closeBtn\.setAttribute\("aria-label", "关闭图片预览"\)/);
  assert.match(source, /overlay\.setAttribute\("role", "dialog"\)/);
});

test("OG generation uses the checked-in IBM Plex Mono font", () => {
  const source = read("src/utils/loadGoogleFont.ts");
  assert.match(source, /LOCAL_IBM_FONT_DIR/);
  assert.match(source, /ibm-plex-mono-latin-400-normal\.woff/);
  assert.match(source, /loadLocalFont/);
});

test("Bangumi sync awaits the stale-snapshot fallback", () => {
  const source = read("scripts/sync-bangumi.mjs");
  assert.match(source, /main\(\)\.catch\(async error =>/);
  assert.doesNotMatch(source, /return hasExistingSnapshot\(\)\.then\(/);
});

test("Pagefind uses body as the root for Astro redirect pages", () => {
  const scripts = JSON.parse(read("package.json")).scripts;
  assert.match(scripts["search:index"], /--root-selector body/);
  assert.match(scripts["search:index:dev"], /--root-selector body/);
});

test("new-tab links explicitly isolate the opener", () => {
  assert.match(
    read("src/components/Footer.astro"),
    /target="_blank"\s+rel="noopener noreferrer"/
  );
  assert.match(
    read("src/pages/index.astro"),
    /target="_blank"[\s\S]*?rel="noopener noreferrer"/
  );
});
