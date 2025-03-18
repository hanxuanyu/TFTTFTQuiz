# 「云顶小测」TFT Quiz Master

一个基于 Vue 3 + Vite 开发的云顶之弈知识问答系统，帮助玩家更好地了解游戏中的棋子、特质和职业。

## 功能特点

- 🎮 支持两种题型：
  - 根据特质和职业猜棋子
  - 根据棋子猜特质和职业
- 📊 实时显示答题进度和得分
- 🔄 支持自动换题功能
- 📱 响应式设计，支持移动端
- 🔍 详细的棋子、特质和职业信息展示
- 🎯 随机生成题目，每次体验都不同

## 技术栈

- Vue 3
- Vite
- Tailwind CSS
- Headless UI
- Vue 3 Composition API

## 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 项目结构

```
tft-question/
├── src/                    # 源代码目录
│   ├── assets/            # 静态资源
│   │   └── data/         # 游戏数据
│   ├── components/        # Vue 组件
│   │   ├── TFTQuiz.vue   # 主问答组件
│   │   ├── ChessDetailModal.vue    # 棋子详情弹窗
│   │   ├── TraitDetailModal.vue    # 特质详情弹窗
│   │   └── ...
│   ├── App.vue           # 根组件
│   ├── main.js           # 入口文件
│   └── style.css         # 全局样式
├── public/               # 公共资源
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
└── tailwind.config.js   # Tailwind 配置
```

## 安装和运行

1. 克隆项目
```bash
git clone [项目地址]
cd tft-question
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

5. 预览生产版本
```bash
npm run preview
```

## 开发说明

- 项目使用 Vue 3 的 Composition API 进行开发
- 使用 Tailwind CSS 进行样式管理
- 使用 Headless UI 组件库实现无样式的可访问性组件
- 数据存储在 `src/assets/data` 目录下的 JSON 文件中

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)
