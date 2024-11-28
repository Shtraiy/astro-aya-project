---
date: 2024-05-15 10:16:21
tags: 
  - 音乐
layout: ../../layouts/MusicLayout.astro
---
<div id="albums">
    <div>
        <link rel="stylesheet" href="/js/APlayer.min.css">
        <div id="aplayer"></div>
        <script src="/js/APlayer.min.js"></script>
    </div>
    <div id="ELECTROCUTICA">
        <h3 style="text-align:center">
            <font color="#948D91">『SWANSONG』</font>
        </h3>
        <script>
            const ap = new APlayer({
                container: document.getElementById('aplayer'),
                mini: false,
                autoplay: false,
                theme: '#948D91',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: 'CRUCIFIxxxION',
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/01.%20CRUCIFIxxxION.flac",
                        cover: '/images/SWANSONG.jpg'
                    },
                    {
                        name: '未必の恋 -Dolus Eventualis-',
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/02.%20%E6%9C%AA%E5%BF%85%E3%81%AE%E6%81%8B%20-Dolus%20Eventualis-.flac",
                        cover: '/images/SWANSONG.jpg'
                    },
                    {
                        name: 'Dependence Intension',
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/03.%20Dependence%20Intension.flac",
                        cover: '/images/SWANSONG.jpg'
                    },
                    {
                        name: "Chaining Intention [Re-form mix]",
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/04.%20Chaining%20Intention%20%5BRe-form%20mix%5D.flac",
                        cover: '/images/SWANSONG.jpg'
                    },
                    {
                        name: 'Piano Lesson',
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/05.%20Piano%20Lesson.flac",
                        cover: '/images/SWANSONG.jpg'
                    },
                    {
                        name: 'STRAWBERRY TRAP',
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/06.%20STRAWBERRY%20TRAP.flac",
                        cover: '/images/SWANSONG.jpg'
                    },
                    {
                        name: 'Chaining Intention',
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/07.%20Chaining%20Intention.flac",
                        cover: '/images/SWANSONG.jpg'
                    },
                    {
                        name: 'SWANSONG',
                        artist: 'ELECTROCUTICA',
                        url: "https://github.com/Resalia/music2/raw/master/ELECTROCUTICA/CYGNUS%20COLLECTION%20SS2016%20'SWANSONG'/08.%20SWANSONG.flac",
                        cover: '/images/SWANSONG.jpg'
                    }
                ]
            });
        </script>
    </div>
</div>

