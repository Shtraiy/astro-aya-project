---
title: COLOURS.04
date: 2024-05-11 16:18:39
tags: 
  - 音乐
---
<div id="albums">
    <div id="Endorfin.">
        <h3 style="text-align:center">
            <font color="#EDC95E">『COLOURS.04 ”Yelling”』</font>
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
                theme: '#EDC95E',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: '水彩のカナリア',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.04%20%E2%80%9DYelling%E2%80%9D/1-01.%20Endorfin.%20-%20%E6%B0%B4%E5%BD%A9%E3%81%AE%E3%82%AB%E3%83%8A%E3%83%AA%E3%82%A2.flac',
                        cover: '/images/COLOURS.04.jpg'
                    },
                    {
                        name: 'citron',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.04%20%E2%80%9DYelling%E2%80%9D/1-02.%20Endorfin.%20-%20citron.flac',
                        cover: '/images/COLOURS.04.jpg'
                    },
                    {
                        name: 'フラフィ',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.04%20%E2%80%9DYelling%E2%80%9D/1-03.%20Endorfin.%20-%20%E3%83%95%E3%83%A9%E3%83%95%E3%82%A3.flac',
                        cover: '/images/COLOURS.04.jpg'
                    },
                    {
                        name: '蛍火の雪',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.04%20%E2%80%9DYelling%E2%80%9D/1-04.%20Endorfin.%20-%20%E8%9B%8D%E7%81%AB%E3%81%AE%E9%9B%AA.flac',
                        cover: '/images/COLOURS.04.jpg'
                    },
                    {
                        name: 'スローアライズ',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.04%20%E2%80%9DYelling%E2%80%9D/1-05.%20Endorfin.%20-%20%E3%82%B9%E3%83%AD%E3%83%BC%E3%82%A2%E3%83%A9%E3%82%A4%E3%82%BA.flac',
                        cover: '/images/COLOURS.04.jpg'
                    },
                    {
                        name: 'COLOURS',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.04%20%E2%80%9DYelling%E2%80%9D/1-06.%20Endorfin.%20-%20COLOURS.flac',
                        cover: '/images/COLOURS.04.jpg'
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