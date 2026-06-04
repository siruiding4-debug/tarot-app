// ===== 塔罗牌核心类型 =====

/** 阿尔卡纳类型 */
export type Arcana = 'major' | 'minor'

/** 小阿尔卡纳牌组 */
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

/** 牌阵类型 */
export type SpreadType = 'single' | 'three-card' | 'triangle' | 'celtic-cross'

/** 仪式流程阶段 */
export type Phase =
  | 'landing'
  | 'question'
  | 'spread-select'
  | 'preparation'
  | 'shuffle'
  | 'cut'
  | 'draw'
  | 'reveal'
  | 'result'

/** 手势类型 */
export type GestureType = 'none' | 'swipe' | 'fist' | 'point' | 'open-palm'

/** 牌的朝向 */
export type Orientation = 'upright' | 'reversed'

// ===== 塔罗牌数据结构 =====

/** 单张塔罗牌定义 */
export interface TarotCard {
  id: number
  name: string // 中文名
  nameEn: string // 英文名
  arcana: Arcana
  suit?: Suit // 小阿尔卡纳才有
  imageUrl: string // 牌面图片
  keywords: string[] // 中文关键词
  meaningUp: string // 正位含义
  meaningDown: string // 逆位含义
  description: string // 牌面图案描述
}

/** 已抽取的牌（含状态） */
export interface DrawnCard {
  card: TarotCard
  orientation: Orientation
  position: number // 在牌阵中的位置索引
  positionName: string // 位置名称（如"过去"、"现在"）
  isRevealed: boolean // 是否已翻牌
}

// ===== 牌阵定义 =====

/** 牌阵位置定义 */
export interface SpreadPosition {
  index: number
  name: string
  description: string
}

/** 牌阵定义 */
export interface SpreadDefinition {
  type: SpreadType
  name: string
  description: string
  cardCount: number
  positions: SpreadPosition[]
}

// ===== 手部关键点 =====

/** MediaPipe 手部关键点 */
export interface HandLandmark {
  x: number
  y: number
  z: number
}

/** 手势检测结果 */
export interface GestureResult {
  type: GestureType
  confidence: number
  landmarks: HandLandmark[] | null
  cursorPosition?: { x: number; y: number } // 食指指向的屏幕坐标
}

// ===== 历史记录 =====

/** 单次抽牌记录 */
export interface ReadingRecord {
  id: string
  timestamp: number
  question: string
  spreadType: SpreadType
  cards: DrawnCard[]
}

// ===== Store 状态 =====

/** 全局应用状态 */
export interface ReadingState {
  phase: Phase
  question: string
  spreadType: SpreadType | null
  drawnCards: DrawnCard[]
  readingHistory: ReadingRecord[]
  isCameraReady: boolean
  isAudioEnabled: boolean

  // 操作
  setPhase: (phase: Phase) => void
  setQuestion: (q: string) => void
  setSpreadType: (t: SpreadType) => void
  addDrawnCard: (card: DrawnCard) => void
  revealCard: (position: number) => void
  saveReading: () => void
  resetReading: () => void
  setCameraReady: (ready: boolean) => void
  toggleAudio: () => void
}
