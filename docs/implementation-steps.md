# 塔罗牌隔空手势抽取网站 - 执行步骤文档

## 开发原则
1. **小步推进**：每个 Step 完成后验证再进入下一步
2. **提交频繁**：每个 Step 完成即 git commit
3. **每日日志**：每天在 dev-log/ 下记录进展
4. **文档同步**：需求变更时同步更新 docs/

## 执行步骤

### Step 1: 项目初始化 ✅
- [x] 创建 Vite + React + TypeScript 项目
- [x] 安装所有依赖（Zustand, Framer Motion, Howler.js, react-webcam, @mediapipe/tasks-vision）
- [x] 创建文档体系（docs/）
- [x] 创建 CLAUDE.md 工作指引
- [x] 配置 Tailwind CSS 4 + @tailwindcss/vite
- [x] 配置 Vite（路径别名 @/）
- [x] 配置全局暗黑主题样式（CSS 变量 + 自定义类）
- [x] 初始化 Git 仓库
- [x] 验证项目编译通过

### Step 2: 塔罗牌数据准备 ✅
- [x] 编写 TarotCard 等类型定义 (src/types/index.ts)
- [x] 整理 78 张牌的中文数据（22 大阿尔卡纳 + 56 小阿尔卡纳）
- [x] 图片来源：Rider-Waite-Smith 公共领域图片（Wikimedia）
- [x] 编写卡牌工具函数（洗牌、逆位随机、牌阵位置分配）
- [x] 编写 localStorage 存储工具

### Step 3: 状态管理与 UI 框架 ✅
- [x] 创建 Zustand readingStore (src/store/readingStore.ts)
- [x] 实现 MysticBackground Canvas 粒子背景（含六芒星装饰）
- [x] 全局暗黑主题样式
- [x] Landing 入口页（含摄像头权限请求）

### Step 4: 手势识别模块 ✅
- [x] WebcamFeed 摄像头组件（含手部骨架线绘制）
- [x] MediaPipe Hands 集成（CDN 加载模型）
- [x] 手势分类器 gestureDetector（滑动/握拳/指向/张掌）
- [x] useGesture Hook（实时检测循环）

### Step 5: 仪式流程页面 ✅
- [x] QuestionInput 问题输入页
- [x] SpreadSelector 牌阵选择页（4 种牌阵）
- [x] PreparationPhase 准备阶段（呼吸光环动画）
- [x] ShufflePhase 洗牌阶段（手势 + 鼠标）
- [x] CutPhase 切牌阶段（自动演示）
- [x] DrawPhase 抽牌阶段（扇形候选牌）
- [x] RevealPhase 翻牌阶段（3D 翻转 + 粒子）

### Step 6: 解读与历史 ✅
- [x] CardDisplay 牌面展示组件（可展开/收起）
- [x] ReadingResult 解读结果页（完整牌阵解读）
- [x] History 历史记录页（localStorage 管理）

### Step 7: 音频集成 ✅
- [x] useAudio Hook (Howler.js)
- [x] 背景音乐 + 音效接口
- [ ] 准备真实音频资源文件

### Step 8: 动效打磨 ✅
- [x] 页面过渡动画（Framer Motion AnimatePresence）
- [x] 卡片 3D 翻转动画
- [x] 粒子特效（翻牌爆发、背景漂浮）
- [x] 呼吸光环动画
- [x] 手势骨架线渲染

### Step 9: 部署 🔄
- [x] 安装 gh-pages
- [x] 配置部署脚本
- [ ] 创建 GitHub 仓库
- [ ] 推送代码
- [ ] 配置 GitHub Pages
- [ ] 验证线上运行

## 下一步计划

### v1.1 增强
- 准备真实音频资源
- 塔罗牌图片本地化
- 移动端响应式适配
- 代码分割优化
- AI 解读集成（可选）
