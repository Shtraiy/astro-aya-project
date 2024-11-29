---
title: 「Proud Echoes」
date: 2024-05-11 10:32:46
tags: 
  - 音乐
layout: ../../layouts/MusicLayout.astro
color: d1061b
---
<div id="albums">
    <div id="Sennzai">
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

