---
title: 「twilight」
date: 2024-05-12 09:44:22
tags: 
  - 音乐
layout: ../../layouts/MusicLayout.astro
color: DEB1DE
---
<div id="albums">
    <div id="明透">
        <script>
            const ap = new APlayer({
                container: document.getElementById('aplayer'),
                mini: false,
                autoplay: false,
                theme: '#DEB1DE',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.3,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
                audio: [
                    {
                        name: 'アンメルト・アンブレラ',
                        artist: '明透',
                        url: 'https://github.com/Resalia/music3/raw/refs/heads/main/twilight/01-%E3%82%A2%E3%83%B3%E3%83%A1%E3%83%AB%E3%83%88%E3%83%BB%E3%82%A2%E3%83%B3%E3%83%96%E3%83%AC%E3%83%A9.flac',
                        cover: '/images/twilight.jpg'
                    },
                    {
                        name: 'Spiral',
                        artist: '明透',
                        url: 'https://github.com/Resalia/music3/raw/refs/heads/main/twilight/02-Spiral.flac',
                        cover: '/images/twilight.jpg'
                    },
                    {
                        name: 'ブルーナイトダーリン',
                        artist: '明透',
                        url: 'https://github.com/Resalia/music3/raw/refs/heads/main/twilight/03-%E3%83%96%E3%83%AB%E3%83%BC%E3%83%8A%E3%82%A4%E3%83%88%E3%83%80%E3%83%BC%E3%83%AA%E3%83%B3.flac',
                        cover: '/images/twilight.jpg'
                    },
                    {
                        name: 'illumina',
                        artist: '明透',
                        url: 'https://github.com/Resalia/music3/raw/refs/heads/main/twilight/04-illumina.flac',
                        cover: '/images/twilight.jpg'
                    },
                                        {
                        name: 'Dazzling',
                        artist: '明透',
                        url: 'https://github.com/Resalia/music3/raw/refs/heads/main/twilight/05-Dazzling.flac',
                        cover: '/images/twilight.jpg'
                    },
                    {
                        name: 'スロウリー - Acoustic Arrange',
                        artist: '明透',
                        url: 'https://github.com/Resalia/music3/raw/refs/heads/main/twilight/06-%E3%82%B9%E3%83%AD%E3%82%A6%E3%83%AA%E3%83%BC%20-%20Acoustic%20Arrange%20-.flac',
                        cover: '/images/twilight.jpg'
                    },
                    {
                        name: 'ソラゴト - Acoustic Arrange',
                        artist: '明透',
                        url: 'https://github.com/Resalia/music3/raw/refs/heads/main/twilight/07-%E3%82%BD%E3%83%A9%E3%82%B4%E3%83%88%20-%20Acoustic%20Arrange%20-.flac',
                        cover: '/images/twilight.jpg'
                    },
                ]
            });
        </script>
    </div>
</div>
