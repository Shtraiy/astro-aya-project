---
title: Proud Echoes
date: 2024-05-11 10:32:46
tags: 
  - 音乐
---
<div id="albums">
    <div id="Sennzai">
        <h3 style="text-align:center">
            <font color="#d1061b">『Proud Echoes』</font>
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
                theme: '#d1061b',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: '白蓮華',
                        artist: 'Sennzai',
                        url: 'https://github.com/Resalia/music2/raw/master/Proud%20Echoes/01.%20%E7%99%BD%E8%93%AE%E8%8F%AF.flac',
                        cover: '/images/Proud-Echoes.jpg'
                    },
                    {
                        name: '全知全能',
                        artist: 'Sennzai',
                        url: 'https://github.com/Resalia/music2/raw/master/Proud%20Echoes/02.%20%E5%85%A8%E7%9F%A5%E5%85%A8%E8%83%BD.flac',
                        cover: '/images/Proud-Echoes.jpg'
                    },
                    {
                        name: '沈黙の塔',
                        artist: 'Sennzai',
                        url: 'https://github.com/Resalia/music2/raw/master/Proud%20Echoes/03.%20%E6%B2%88%E9%BB%99%E3%81%AE%E5%A1%94.flac',
                        cover: '/images/Proud-Echoes.jpg'
                    },
                    {
                        name: 'Dimension',
                        artist: 'Sennzai',
                        url: 'https://github.com/Resalia/music2/raw/master/Proud%20Echoes/04.%20Dimension.flac',
                        cover: '/images/Proud-Echoes.jpg'
                    },
                    {
                        name: '春宵胡蝶',
                        artist: 'Sennzai',
                        url: 'https://github.com/Resalia/music2/raw/master/Proud%20Echoes/05.%20%E6%98%A5%E5%AE%B5%E8%83%A1%E8%9D%B6.flac',
                        cover: '/images/Proud-Echoes.jpg'
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