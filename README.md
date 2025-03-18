# TFT 云顶之弈知识问答

一个基于 Vue 3 开发的云顶之弈知识问答应用，帮助玩家测试和提升对游戏机制的理解。

## 功能特点

- 🎮 随机生成云顶之弈相关题目
- 📝 支持两种题型：
  - 根据特质和职业猜棋子
  - 根据棋子猜特质和职业
- 🎯 实时反馈答题结果
- 📊 显示答题进度和得分
- 🔄 支持自动跳过正确答案
- 📱 响应式设计，支持移动端和桌面端
- 🔄 数据自动更新，优先使用远程数据
- 📦 使用 Pinia 进行状态管理
- 🎨 使用 Tailwind CSS 构建现代化 UI

## 技术栈

- Vue 3 (Composition API)
- Vite
- Pinia (状态管理)
- Tailwind CSS
- Headless UI

## 数据来源

应用数据来自以下三个来源：

1. 远程数据（优先）：
   - 棋子数据：`https://game.gtimg.cn/images/lol/act/img/tft/js/chess.js`
   - 特质数据：`https://game.gtimg.cn/images/lol/act/img/tft/js/race.js`
   - 职业数据：`https://game.gtimg.cn/images/lol/act/img/tft/js/job.js`

2. 本地数据（备用）：
   - 位于 `src/assets/data/tft13/` 目录下的 JSON 文件

## 项目结构

```
src/
├── assets/
│   └── data/
│       └── tft13/
│           ├── chess.json
│           ├── job.json
│           └── race.json
├── components/
│   ├── TFTQuiz.vue
│   ├── ChessDetailModal.vue
│   ├── TraitDetailModal.vue
│   ├── QuizCompleteModal.vue
│   └── Switch.vue
├── stores/
│   └── gameData.js
├── utils/
│   └── dataLoader.js
├── App.vue
└── main.js
```

## 开发环境设置

1. 克隆项目：
```bash
git clone [项目地址]
cd TFTQuiz
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
```

## 使用说明

1. 启动应用后，系统会自动加载游戏数据
2. 每轮测试包含 10 个随机题目
3. 每道题目有 4 个选项
4. 答题后可以：
   - 查看正确答案
   - 查看详细信息
   - 进入下一题
5. 可以开启/关闭自动跳过正确答案的功能
6. 完成所有题目后显示最终得分

## 数据更新机制

- 应用启动时优先从远程获取最新数据
- 如果远程数据获取失败，自动使用本地数据
- 使用 Pinia 进行数据缓存，避免重复请求
- 支持并发数据加载，确保数据一致性

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License
