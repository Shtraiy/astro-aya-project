---
layout: ../layouts/AboutLayout.astro
title: 关于站长
description: 关于站长，以及这个站点的一些小事
---

![Aitsuki Nakuru](/css/logo.png)

爱好是游戏、电影和番剧，喜欢听歌，最喜欢听**藍月なくる**的歌

最喜欢的专辑是**AD:PIANO V**

最喜欢的游戏系列是《黑暗之魂》系列

会不定期更新一些自己的近况以及对一些技术备忘录形式的笔记

<h2 id="education">🎓 教育经历</h2>

<div class="edu-list">
  <a
    class="edu-card"
    href="https://www.guet.edu.cn/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="打开桂林电子科技大学官网"
  >
    <span class="edu-badge" aria-hidden="true">GUET</span>
    <span class="edu-main">
      <span class="edu-status">硕士在读</span>
      <span class="edu-school">桂林电子科技大学</span>
      <span class="edu-major">机械工程 · 硕士</span>
      <span class="edu-period">2026 - 至今</span>
    </span>
  </a>
  <a
    class="edu-card"
    href="https://www.glut.edu.cn/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="打开桂林理工大学官网"
  >
    <span class="edu-badge" aria-hidden="true">GLUT</span>
    <span class="edu-main">
      <span class="edu-status">本科</span>
      <span class="edu-school">桂林理工大学</span>
      <span class="edu-major">自动化 · 学士</span>
      <span class="edu-period">2022 - 2026</span>
    </span>
  </a>
</div>

## 关于本站

> 于2020年11月30日正式开始运营

SilentCage名字的灵感来源于Endorfin.蓝专的《無言の鳥籠》这首歌

曾用域名*wynio.online*

本站或将长期使用*wynio.pw*这个域名

<style>
/*
  教育经历卡片。markdown 里的 <style> 会原样输出成全局样式，
  所以用 --palette-* 变量取色，浅色 / 夜间两套主题都自动跟随。
*/
.edu-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin: 1.25rem 0 2rem;
}
.edu-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  border: 1px solid rgb(var(--palette-border));
  border-radius: 0.875rem;
  color: inherit;
  text-decoration: none !important;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.edu-card:hover {
  border-color: color-mix(
    in srgb,
    rgb(var(--palette-muted-text)) 55%,
    transparent
  );
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.08);
}
.edu-badge {
  display: grid;
  place-items: center;
  flex: none;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid rgb(var(--palette-border));
  border-radius: 0.75rem;
  background-color: rgb(var(--palette-muted));
  color: rgb(var(--palette-muted-text));
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.edu-main {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}
.edu-status {
  font-size: 0.75rem;
  color: rgb(var(--palette-accent));
}
.edu-school {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  color: rgb(var(--palette-text));
}
.edu-major {
  font-size: 0.875rem;
  color: rgb(var(--palette-muted-text));
}
.edu-period {
  font-size: 0.75rem;
  color: rgb(var(--palette-muted-text));
  opacity: 0.85;
}
/* 夜间模式下卡片底色比页面底色略亮一点，边界才看得出 */
html[data-theme="dark"] .edu-card {
  background-color: color-mix(
    in srgb,
    rgb(var(--palette-card)) 22%,
    transparent
  );
}
</style>
