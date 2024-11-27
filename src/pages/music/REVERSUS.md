---
title: REVERSUS
date: 2024-05-15 10:08:54
tags: 
  - 音乐
---
<div id="albums">
    <div id="ELECTROCUTICA">
        <h3 style="text-align:center">
            <font color="#1C211D">『REVERSUS』</font>
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
                theme: '#1C211D',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: 'Reversus',
                        artist: 'ELECTROCUTICA/ルシュカ',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/01.Reversus.flac',
                        cover: '/images/REVERSUS.jpg'
                    },
                    {
                        name: 'fluctus fractus',
                        artist: 'ELECTROCUTICA',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/02.fluctus%20fractus.flac',
                        cover: '/images/REVERSUS.jpg'
                    },
                    {
                        name: 'Melaleuca',
                        artist: 'ELECTROCUTICA',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/03.Melaleuca.flac',
                        cover: '/images/REVERSUS.jpg'
                    },
                    {
                        name: "Illusionika",
                        artist: 'ELECTROCUTICA/やなぎなぎ',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/04.Illusionika.flac",
                        cover: '/images/REVERSUS.jpg'
                    },
                    {
                        name: '#006F86',
                        artist: 'ELECTROCUTICA/ルシュカ',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/05.%23006F86.flac',
                        cover: '/images/REVERSUS.jpg'
                    },
                    {
                        name: 'vice versa',
                        artist: 'ELECTROCUTICA',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/06.vice%20versa.flac',
                        cover: '/images/REVERSUS.jpg'
                    },
                    {
                        name: 'Triplaneta',
                        artist: 'ELECTROCUTICA',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/07.Triplaneta.flac',
                        cover: '/images/REVERSUS.jpg'
                    },
                    {
                        name: 'Lullaby',
                        artist: 'ELECTROCUTICA',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/REVERSUS/08.Lullaby.flac',
                        cover: '/images/REVERSUS.jpg'
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