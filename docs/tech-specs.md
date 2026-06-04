# 塔罗牌隔空手势抽取网站 - 技术规范文档

## 技术栈

| 层次 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | React | 18.x | UI 组件框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 构建 | Vite | 6.x | 开发服务器与打包 |
| 样式 | Tailwind CSS | 4.x | 原子化 CSS |
| 动画 | Framer Motion | 11.x | 声明式动画 |
| 状态管理 | Zustand | 5.x | 轻量全局状态 |
| 手势识别 | MediaPipe Tasks Vision | 0.10.x | 手部关键点检测 |
| 音频 | Howler.js | 2.x | 跨浏览器音频 |
| 摄像头 | react-webcam | 9.x | React 摄像头组件 |

## 项目结构规范

```
tarot-app/
├── docs/                    # 项目文档
│   ├── requirements.md      # 需求文档
│   ├── tech-specs.md        # 技术规范（本文件）
│   ├── design-standards.md  # 设计规范
│   └── implementation-steps.md # 执行步骤
├── dev-log/                 # 开发日志
│   └── YYYY-MM-DD.md        # 每日日志
├── public/
│   └── audio/               # 音频资源
├── src/
│   ├── components/          # React 组件
│   │   ├── ritual/          # 仪式阶段组件
│   │   ├── Landing.tsx
│   │   ├── QuestionInput.tsx
│   │   ├── SpreadSelector.tsx
│   │   ├── CardDisplay.tsx
│   │   ├── ReadingResult.tsx
│   │   ├── History.tsx
│   │   ├── WebcamFeed.tsx
│   │   └── MysticBackground.tsx
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useGesture.ts
│   │   └── useAudio.ts
│   ├── data/                # 静态数据
│   │   └── tarotCards.ts
│   ├── store/               # Zustand Store
│   │   └── readingStore.ts
│   ├── utils/               # 工具函数
│   │   ├── gestureDetector.ts
│   │   ├── cardUtils.ts
│   │   └── storage.ts
│   ├── types/               # TypeScript 类型
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── CLAUDE.md                # Claude 工作指引
├── package.json
├── vite.config.ts
├── tailwind.config.js       # Tailwind 配置（如需要）
└── tsconfig.json
```

## 编码规范

### TypeScript
- 所有新文件使用 `.tsx` 或 `.ts`
- 类型定义集中在 `src/types/index.ts`
- 组件 Props 使用 interface 定义
- 避免使用 `any`，必要时使用 `unknown`

### React 组件
- 函数组件 + Hooks
- 一个文件一个组件（导出默认）
- 组件名使用 PascalCase
- Props interface 命名为 `{ComponentName}Props`

### 样式
- 优先使用 Tailwind 类名
- 自定义样式使用 CSS 变量
- 动画使用 Framer Motion 的 `motion` 组件
- 颜色使用预定义的 CSS 变量

### 文件命名
- 组件文件：PascalCase.tsx
- Hook 文件：camelCase.ts（useXxx）
- 工具文件：camelCase.ts
- 数据文件：camelCase.ts

## 关键依赖说明

### MediaPipe Hands
- 模型加载：从 CDN 加载 hand_landmarker.task
- 输入：HTMLVideoElement（摄像头）
- 输出：21个手部关键点 (x, y, z) 归一化坐标
- WASM 后端，GPU 加速

### Zustand Store 设计
```typescript
interface ReadingStore {
  // 流程状态
  phase: 'landing' | 'question' | 'spread-select' | 'preparation' | 'shuffle' | 'cut' | 'draw' | 'reveal' | 'result';
  // 用户数据
  question: string;
  spreadType: 'single' | 'three-card' | 'triangle' | 'celtic-cross';
  // 抽取结果
  drawnCards: DrawnCard[];
  // 操作
  setPhase: (phase: string) => void;
  setQuestion: (q: string) => void;
  setSpreadType: (t: string) => void;
  addDrawnCard: (card: DrawnCard) => void;
  resetReading: () => void;
}
```

## 安全注意事项
- 摄像头数据仅本地处理，不发送到任何服务器
- 不收集用户个人信息
- localStorage 仅存储抽牌结果
- HTTPS 部署（摄像头 API 要求安全上下文）
