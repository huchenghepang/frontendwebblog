# 个人博客网站

> 基于Vue3+TS开发的个人博客网站，支持文章的在线预览和分类，可以对文章进行搜索和评论。并且配备后台管理系统，支持文章的增删改查，用户的管理以及用户的权限管理。此外，还实现了根据用户的不同角色的不同权限动态的生成前端路由，以及更细小的颗粒度的按钮权限。文章主要支持markdown格式的文章，能动态生成文章的目录和文字文章内容。

---

## 📚 目录

- [项目背景](#-项目背景)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [贡献指南](#-贡献指南)
- [支持的开源协议](#-支持的开源协议)
- [常见问题](#-常见问题)
- [未来计划](#-未来计划)

---

## 🌟 项目背景

### **项目目的**
- 为渴望拥有自己的独立网站的人群，构建一个功能强大且易于使用支持扩展的个人博客网站。

### **适用场景**
- 个人博客网站：个人博客网站是一种展示个人作品、分享经验和观点的平台。
- 后台管理：项目的后台管理配置和实现可以轻松的实现路由的生成，适宜扩展其他功能。

---

## ✨ 功能特性

- [x] 文章在线预览
- [x] 文章分类
- [x] 文章的标签和搜索
- [x] 动态路由生成
- [x] 文章的评论功能
- [x] 后台管理系统
- [x] 支持markdown格式的文章
- [x] 支持浏览器离线导入文章预览
- [x] 支持用户的注册和登录
- [x] 支持用户的权限管理
- [x] 支持用户的头像和昵称的修改
- [x] 支持用户的角色管理
- [x] 在线的匿名聊天室

---

## 🛠️ 技术栈

列出项目所用的主要技术及工具：

- **前端**：Vue.js 3、Vite、Pinia、Axios、Element Plus、Vue Router、Socket.io
- **其他工具**：ESLint、TypeScript

---

## 📂 项目结构

```plaintext
project/
┣ docs/
┣ public/
┃ ┣ avator/
┃ ┣ images/
┃ ┗ source/
┗ src/
  ┣ api/
  ┣ assets/
  ┣ components/
  ┣ config/
  ┣ hooks/
  ┣ layout/
  ┣ router/
  ┣ schema/
  ┣ stores/
  ┣ types/
  ┣ utils/
  ┗ views/
```

---

## 🚀 快速开始

### **开发环境要求**

- Node.js 
- npm 或 pnpm >= 7.0

### **本地运行步骤**

1. **克隆仓库**
   ```bash
   git clone https://github.com/huchenghepang/frontendwebblog.git
   cd frontendwebblog
   ```

2. **安装依赖**
   ```bash
   pnpm install
   npm install # 或者 npm install
   ```

3. **启动后端服务**
   具体参照[后端项目](https://github.com/huchenghepang/webblog)的文档
4. **启动前端项目**
   本地运行：
   ```bash
   pnpm run dev
   npm run dev # 或者 npm run dev
   ```
   打包构建：
   ```bash
   pnpm run build
   npm run build # 或者 npm run build
   ```

5. **访问项目**
   打开浏览器并访问 `http://localhost:5143`。

---

## 📜 支持的开源协议

本项目基于 **MIT 协议** 开源，具体协议内容请查看 [LICENSE 文件](./LICENSE)。

---

## ❓ 常见问题

### **1. 为什么我的项目没有音乐播放器？**
**回答：** 由于音乐播放器，用原生JavaScript写的另一个项目所以没有打包进项目中。若要使用音乐播放器，需要自己下载另一个项目并配置。具体参照：[音乐播放器](https://github.com/huchenghepang/musicplayer)

---

## 🚧 未来计划

- 支持更多主题样式
- 支持多种登录方式
- 支持用户的收藏功能
- 支持用户的关注功能

---

## ❤️ 鸣谢

感谢以下开源项目和工具的支持：

- Vue.js
- Node.js
- npm
- pnpm
- socket.io
