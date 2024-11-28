---
date: 2024-05-11 12:16:46
---
<div id="albums">
    <div id="Endorfin.">
        <h3 style="text-align:center">
            <font color="#47d649">『COLOURS.01 “Growing”』</font>
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
                theme: '#47d649',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: 'a fairy with you',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.01%20%E2%80%9CGrowing%E2%80%9D/01.%20a%20fairy%20with%20you.flac',
                        cover: '/images/COLOURS.01.jpg'
                    },
                    {
                        name: '花残り、蕾ひとつ(花凋零 蕾孤绽)',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.01%20%E2%80%9CGrowing%E2%80%9D/02.%20%E8%8A%B1%E6%AE%8B%E3%82%8A%E3%80%81%E8%95%BE%E3%81%B2%E3%81%A8%E3%81%A4.flac',
                        cover: '/images/COLOURS.01.jpg'
                    },
                    {
                        name: 'サニーサイド・クローバー(向阳的四叶草)',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.01%20%E2%80%9CGrowing%E2%80%9D/03.%20%E3%82%B5%E3%83%8B%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%83%BB%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%90%E3%83%BC.flac',
                        cover: '/images/COLOURS.01.jpg'
                    },
                    {
                        name: 'Transistor',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.01%20%E2%80%9CGrowing%E2%80%9D/04.%20Transistor.flac',
                        cover: '/images/COLOURS.01.jpg'
                    },
                    {
                        name: 'route signal',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.01%20%E2%80%9CGrowing%E2%80%9D/05.%20route%20signal.flac',
                        cover: '/images/COLOURS.01.jpg'
                    },
                    {
                        name: 'アンチグレーズ(Anti Glaze)',
                        artist: 'Endorfin.',
                        url: 'https://github.com/Resalia/music1/raw/main/COLOURS.01%20%E2%80%9CGrowing%E2%80%9D/06.%20%E3%82%A2%E3%83%B3%E3%83%81%E3%82%B0%E3%83%AC%E3%83%BC%E3%82%BA.flac',
                        cover: '/images/COLOURS.01.jpg'
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
