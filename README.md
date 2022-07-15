# 矿石镇 Plus

《牧场物语 重聚矿石镇》的半自动辅助工具

## 功能

- 节日提醒
- 生日提醒
- 动物出生提醒
- 商店营业状态

## 启动

本项目使用 axios.js 加载 json 格式的数据。  
直接打开 `index.html` 进行使用，会有浏览器跨域问题，导致无法加载数据。  
推荐部署在 `Nginx` `Apache` 等 HTTP 服务器下使用。  
如需临时使用，则推荐使用 `python3 -m http.server 3000`

使用过程中如遇 BUG 请尝试清空浏览器缓存，或在控制台输入`localStorage.clear()`
