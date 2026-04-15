---
layout: ../layouts/LinksLayout.astro
---
<div id="friends">

# 🔗友情链接

> 友情链接（简称“友链”）是指两个网站之间相互放置对方网站链接的行为。这种做法的主要目的是通过互相推荐，增加彼此网站的访问量和搜索引擎排名。友情链接通常位于网站的首页或专门的友情链接页面，是一种常见的网络推广手段。它可以提高网站的曝光率、增加流量，并有助于提升网站在搜索引擎中的权重。

## 本页为友链页，以下是本站友链

<div class="link-container">
  <!-- 友链卡片 1 -->
  <a class="link-card" href="https://jimmy0w0.me/" target="_blank">
    <img class="avatar" src="https://jimmy0w0.me/favicon.svg" alt="Jimmy0w0">
    <div class="content">
      <span class="name">Jimmy0w0</span>
      <span class="description">Babel Tower</span>
    </div>
  </a>
  <!-- 友链卡片 2 -->
  <a class="link-card" href="https://subilan.win" target="_blank" style="background-color: #009688;">
    <img class="avatar" src="https://subilan.win/avatar.jpg" alt="Subilan">
    <div class="content">
      <span class="name" style="color: rgb(235, 171, 87)">Subilan's Blog</span>
      <span class="description" style="color: rgb(235, 171, 87)">Satellite yourself</span>
    </div>
  </a>
  <!-- 友链卡片 3 -->
  <a class="link-card" href="https://seamain.org" target="_blank">
    <img class="avatar" src="https://pub-524ce7a864bb45428804d1b8a36d5de7.r2.dev/41C3EE1A37915E8E63F62929F89287B1.jpg" alt="Seamain">
    <div class="content">
      <span class="name">Seamain</span>
      <span class="description">普通的Blog</span>
    </div>
  </a>
</div>

## 友链申请

在申请友链之前，请确保阅读过以下须知：

> 1.网站的内容必须健康合法，不得违反法律法规或包含不良信息<br>
> 2.网站内容应以原创为主，严禁包含剽窃、洗稿或极其劣质的采集内容<br>
> 3.网站若转载他人文章，必须严格遵守原作者协议并明确标注出处<br>
> 4.友链申请基于互惠原则，申请前请先在贵站添加本站链接<br>
> 5.长期无法访问的域名将被暂时移除；若无法联系到博主或长期未恢复，本站有权单方面终止友链

如果您觉得能够接受以上内容，可以通过如下的方式联系到我交换友链：

+ 通过GitHub的项目提交issue联系到我，[点此前往](https://github.com/Shtraiy/Blog)
+ 通过邮件联系到我，[点此联系](mailto:resalia@wynio.pw)

在您添加友链的时候可以参考如下信息：

> 网站名称：Nocturne<br>
> 网站介绍：The Encyclopedia of Ivory Tower<br>
> 网站主题色：#fc03e3<br>
> 网站地址：https://wynio.pw<br>
> 头像：https://wynio.pw/css/logo.png

## 最后，感谢相遇！

<style>
#friends h1 {
    background: linear-gradient(#ba3453, #a234ba) !important;
    -webkit-background-clip: text !important;
    color: transparent !important;
    font-size: 2rem;
    line-height: 1.2;
}

#friends h2 {
    background: linear-gradient(#af34ba, #6334ba) !important;
    -webkit-background-clip: text !important;
    color: transparent !important;
    font-size: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

.link-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px; 
    margin-top: 15px;
}

.link-card {
    display: flex;
    align-items: center; 
    justify-content: flex-start !important; 
    text-align: left !important; 
    width: 300px; 
    padding: 10px 15px;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.1);
    text-decoration: none !important; 
    color: inherit;
    transition: all 0.3s ease; 
}

.link-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
    transform: translateY(-2px); 
}

.link-card .avatar {
    flex-shrink: 0; 
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover; 
    margin: 0 15px 0 0 !important; 
}

.link-card .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 这里去掉了 !important，加上了 #friends 增加权重，让你的内联颜色生效 */
#friends .link-card .name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #555555;
    margin-bottom: 5px;
}

#friends .link-card .description {
    font-size: 0.85rem;
    color: #888888;
    line-height: 1.2;
}
</style>

</div>
