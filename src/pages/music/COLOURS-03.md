---
title: COLOURS.03
date: 2024-05-11 16:18:35
tags: 
  - 音乐
---
<div id="albums">
    <div id="Endorfin.">
        <h3 style="text-align:center">
            <font color="#D02B27">『COLOURS.03 “Redraw”』</font>
        </h3>
        <div>
            <link rel="stylesheet" href="/js/APlayer.min.css">
            <div id="aplayer"></div>
            <script src="/js/APlayer.min.js"></script>
        </div>
        <script>
            const ap = new APlayer({
                container: document.getElementById('aplayer'),
                mini: false,
                autoplay: false,
                theme: '#D02B27',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: 'Apricot',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.03%20%E2%80%9CRedraw%E2%80%9D/01%20Apricot.flac',
                        cover: '/images/COLOURS.03.jpg'
                    },
                    {
                        name: 'ペンと林檎とわたし(画笔与苹果与我)',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.03%20%E2%80%9CRedraw%E2%80%9D/02%20%E3%83%9A%E3%83%B3%E3%81%A8%E6%9E%97%E6%AA%8E%E3%81%A8%E3%82%8F%E3%81%9F%E3%81%97.flac',
                        cover: '/images/COLOURS.03.jpg'
                    },
                    {
                        name: 'ハートレス・トリコロール',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.03%20%E2%80%9CRedraw%E2%80%9D/03%20%E3%83%8F%E3%83%BC%E3%83%88%E3%83%AC%E3%82%B9%E3%83%BB%E3%83%88%E3%83%AA%E3%82%B3%E3%83%AD%E3%83%BC%E3%83%AB.flac',
                        cover: '/images/COLOURS.03.jpg'
                    },
                    {
                        name: 'ストレンジレッド',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.03%20%E2%80%9CRedraw%E2%80%9D/04%20%E3%82%B9%E3%83%88%E3%83%AC%E3%83%B3%E3%82%B8%E3%83%AC%E3%83%83%E3%83%89.flac',
                        cover: '/images/COLOURS.03.jpg'
                    },
                    {
                        name: 'Untitled Sky',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.03%20%E2%80%9CRedraw%E2%80%9D/05%20Untitled%20Sky.flac',
                        cover: '/images/COLOURS.03.jpg'
                    },
                    {
                        name: '雷花',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.03%20%E2%80%9CRedraw%E2%80%9D/06%20%E9%9B%B7%E8%8A%B1.flac',
                        cover: '/images/COLOURS.03.jpg'
                    }
                ]
            });
        </script>
    </div>
</div>

<div id="back-bottom">
    <a href="/posts/resalia的音乐藏馆/">
    <div class="link">
      <div class="content">
        点此返回
      </div>
    </div>
    </a>
</div>

<style>
  #back-bottom {
    text-align:center;
    .link {
      display: inline-block;
      padding: 8px 14px 8px 14px;
      border: 0.5px solid rgba(0,0,0,0.3);
      border-radius: 40px;
      margin-right: -4px;
      margin-bottom: 5px;
    }
    .content {
      float: right;
      display: flex;
      margin: 8px 8px 8px 8px;
      height: 50%;
      background: linear-gradient(#f52fa9,#3191d6);
      -webkit-background-clip: text;
      color: transparent;
    }
    .link:hover {
      box-shadow: 0 0 10px 1px rgba(0,0,0,0.2);
    }
  }
</style>