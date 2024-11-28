---
date: 2024-05-15 10:08:54
tags: 
  - 音乐
layout: ../../layouts/MusicLayout.astro
---
<div id="albums">
    <div id="ELECTROCUTICA">
        <h3 style="text-align:center">
            <font color="#1C211D">『REVERSUS』</font>
        </h3>
        <div>
            <div id="aplayer"></div>
            <link rel="stylesheet" href="/js/APlayer.min.css">
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

