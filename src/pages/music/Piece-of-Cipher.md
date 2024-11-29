---
date: 2024-05-15 09:54:44
tags:
  - 音乐
layout: ../../layouts/MusicLayout.astro
---
<div id="albums">
    <div id="ELECTROCUTICA">
        <h3 style="text-align:center">
            <font color="#A7A7A7">『Piece of Cipher+』</font>
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
                theme: '#A7A7A7',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: 'Piece of Cipher',
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/01.%20Piece%20of%20Cipher.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'Chaining Intention',
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/02.%20Chaining%20Intention.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'Dependence Intension',
                        artist: 'ELECTROCUTICA/初音ミク/巡音ルカ',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/03.%20Dependence%20Intension.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: "L'azur",
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/04.%20L'azur.flac",
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'Light Snow',
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/05.%20Light%20Snow.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'Blindness',
                        artist: 'ELECTROCUTICA/初音ミク/巡音ルカ',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/06.%20Blindness.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'Drain',
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/07.%20Drain.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: '0259 in my room',
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/08.%200259%20in%20my%20room.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'Fantasia Nr.1',
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/09.%20Fantasia%20Nr.1.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'Fantasia Nr.2',
                        artist: 'ELECTROCUTICA/初音ミク/巡音ルカ',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/10.%20Fantasia%20Nr.2.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    },
                    {
                        name: 'あめふるはこにわ',
                        artist: 'ELECTROCUTICA/初音ミク',
                        url: 'https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/Piece%20of%20Cipher+/11.%20%E3%81%82%E3%82%81%E3%81%B5%E3%82%8B%E3%81%AF%E3%81%93%E3%81%AB%E3%82%8F.flac',
                        cover: '/images/Piece-of-Cipher+.png'
                    }
                ]
            });
        </script>
    </div>
</div>

