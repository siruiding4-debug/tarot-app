# CLAUDE.md - 塔罗牌隔空手势抽取网站

> Claude Code 工作指引文件。每次启动时，Claude 会读取此文件了解项目背景和工作规范。

## 项目概述
暗黑神秘风格的塔罗牌抽取网站。用户通过隔空手势（摄像头 + MediaPipe Hands）完成洗牌、切牌、抽牌、翻牌等仪式流程。

## 重要：文档体系

本项目所有标准文件位于 `docs/` 目录。在开始任何工作前，**必须先查阅相关文档**：

| 文档 | 路径 | 说明 |
|------|------|------|
| 开发需求 | [docs/requirements.md](docs/requirements.md) | 功能和版本规划 |
| 技术规范 | [docs/tech-specs.md](docs/tech-specs.md) | 技术栈、编码规范、架构 |
| 设计规范 | [docs/design-standards.md](docs/design-standards.md) | 配色、字体、动画、布局 |
| 执行步骤 | [docs/implementation-steps.md](docs/implementation-steps.md) | 当前进度和下一步 |

## 开发日志

- 每日工作结束后，在 `dev-log/YYYY-MM-DD.md` 记录：
  - 当天完成的事项
  - 遇到的问题及解决方案
  - 待办事项
  - 下一天计划
- 开发日志模板：参考 [dev-log/_template.md](dev-log/_template.md)

## 工作规范

### 开始新任务前
1. 先阅读 `docs/implementation-steps.md` 了解当前进度
2. 确认要做的步骤没有被标记为已完成
3. 阅读与该步骤相关的规范文档

### 完成任务后
1. 更新 `docs/implementation-steps.md` 中对应步骤的状态
2. 在 `dev-log/` 写入当日开发日志
3. 确认项目能正常编译运行
4. Git commit（如用户要求）

### 代码质量要求
- TypeScript strict mode，不使用 `any`
- 组件单向数据流，状态集中在 Zustand store
- 所有 UI 使用 Tailwind CSS + 设计规范的 CSS 变量
- 动画使用 Framer Motion `motion` 组件
- 英文注释，中文面向用户的内容

### 安全红线
- ⚠️ 摄像头数据**绝对不上传**，仅本地处理
- ⚠️ 不收集任何用户个人信息
- ⚠️ 所有第三方依赖需审核安全性

## 常用命令

```bash
# 开发启动
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

## 技术要点速查

- **手势识别**：`@mediapipe/tasks-vision` 的 HandLandmarker，21个关键点
- **状态管理**：`src/store/readingStore.ts` (Zustand)
- **塔罗数据**：`src/data/tarotCards.ts` (78张牌)
- **手势分类**：`src/utils/gestureDetector.ts`
- **卡牌工具**：`src/utils/cardUtils.ts`
- **本地存储**：`src/utils/storage.ts`
- **类型定义**：`src/types/index.ts`

## 流程阶段枚举

```
landing → question → spread-select → preparation → shuffle → cut → draw → reveal → result
```
