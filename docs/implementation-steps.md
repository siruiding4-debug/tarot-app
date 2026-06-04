# 塔罗牌隔空手势抽取网站 - 执行步骤文档

## 开发原则
1. **小步推进**：每个 Step 完成后验证再进入下一步
2. **提交频繁**：每个 Step 完成即 git commit
3. **每日日志**：每天在 dev-log/ 下记录进展
4. **文档同步**：需求变更时同步更新 docs/

## 执行步骤

### Step 1: 项目初始化 ✅
- [x] 创建 Vite + React + TypeScript 项目
- [x] 安装所有依赖
- [x] 创建文档体系（docs/）
- [x] 创建 CLAUDE.md 工作指引
- [x] 配置 Tailwind CSS
- [x] 配置 Vite（路径别名等）
- [x] 初始化 Git 仓库
- [ ] 验证项目能正常启动

### Step 2: 基础 UI 框架
- [ ] 配置 Tailwind 主题色（CSS 变量）
- [ ] 全局样式（背景、字体、滚动条）
- [ ] MysticBackground 粒子背景组件
- [ ] 通用 Layout 组件
- [ ] 页面过渡动画组件

### Step 3: 塔罗牌数据准备
- [ ] 编写 TarotCard 类型定义
- [ ] 整理 78 张牌的中文数据（名称、关键词、正逆位含义）
- [ ] 确定图片来源方案
- [ ] 编写卡牌工具函数（洗牌、逆位随机、牌阵分配）

### Step 4: 状态管理
- [ ] 创建 Zustand readingStore
- [ ] 创建 localStorage 工具函数
- [ ] 类型定义完善

### Step 5: 手势识别模块
- [ ] WebcamFeed 摄像头组件
- [ ] MediaPipe Hands 初始化
- [ ] 手势分类器（gestureDetector.ts）
- [ ] useGesture Hook
- [ ] 手势调试 UI（骨架线渲染）

### Step 6: 仪式流程 - 前半段
- [ ] Landing 入口页
- [ ] QuestionInput 问题输入页
- [ ] SpreadSelector 牌阵选择页
- [ ] PreparationPhase 准备阶段

### Step 7: 仪式流程 - 后半段
- [ ] ShufflePhase 洗牌阶段
- [ ] CutPhase 切牌阶段
- [ ] DrawPhase 抽牌阶段
- [ ] RevealPhase 翻牌阶段

### Step 8: 解读与历史
- [ ] CardDisplay 牌面展示组件
- [ ] ReadingResult 解读结果页
- [ ] History 历史记录页
- [ ] 牌阵布局组件

### Step 9: 音频集成
- [ ] 收集免费音效资源
- [ ] useAudio Hook
- [ ] 各阶段音效触发

### Step 10: 动效打磨
- [ ] 卡片翻牌 3D 动画
- [ ] 粒子特效细节
- [ ] 过渡动画优化
- [ ] 手势交互反馈

### Step 11: 部署
- [ ] 构建生产版本
- [ ] 部署到 GitHub Pages
- [ ] 测试摄像头 HTTPS 要求
- [ ] 跨浏览器测试
