import type { GestureResult, HandLandmark } from '@/types'

/**
 * MediaPipe 手部关键点索引
 * 0: 手腕, 1-4: 拇指, 5-8: 食指, 9-12: 中指, 13-16: 无名指, 17-20: 小指
 */
const THUMB_TIP = 4
const INDEX_TIP = 8
const MIDDLE_TIP = 12
const RING_TIP = 16
const PINKY_TIP = 20
const PALM_CENTER = 9 // 使用中指根部作为手掌中心近似

/** 两点间欧几里得距离（归一化坐标） */
function distance(a: HandLandmark, b: HandLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

/** 手指是否伸展（指尖到中指MCP的距离 > 阈值） */
function isFingerExtended(tip: HandLandmark, landmarks: HandLandmark[]): boolean {
  const mcp = landmarks[PALM_CENTER]
  const dist = distance(tip, mcp)
  // 归一化阈值：手指伸展时距离较大
  return dist > 0.3
}

// 滑动检测的历史记录
let palmHistory: { x: number; y: number; time: number }[] = []
const SWIPE_HISTORY_MS = 500 // 保留 500ms 的历史
const SWIPE_MIN_DISTANCE = 0.08 // 最小滑动距离（归一化）
const SWIPE_MIN_SPEED = 0.15 // 最小滑动速度

/**
 * 检测手势类型
 * @param landmarks 手部 21 个关键点（归一化坐标）
 * @param canvasWidth 画布宽度（用于计算屏幕坐标）
 * @param canvasHeight 画布高度（用于计算屏幕坐标）
 */
export function detectGesture(
  landmarks: HandLandmark[] | null,
  canvasWidth: number,
  canvasHeight: number
): GestureResult {
  if (!landmarks || landmarks.length < 21) {
    return { type: 'none', confidence: 0, landmarks: null }
  }

  const now = Date.now()

  // 计算各手指是否伸展
  const indexExtended = isFingerExtended(landmarks[INDEX_TIP], landmarks)
  const middleExtended = isFingerExtended(landmarks[MIDDLE_TIP], landmarks)
  const ringExtended = isFingerExtended(landmarks[RING_TIP], landmarks)
  const pinkyExtended = isFingerExtended(landmarks[PINKY_TIP], landmarks)
  const thumbExtended = isFingerExtended(landmarks[THUMB_TIP], landmarks)

  const extendedCount = [
    thumbExtended,
    indexExtended,
    middleExtended,
    ringExtended,
    pinkyExtended,
  ].filter(Boolean).length

  // 获取手掌中心位置
  const palmX = landmarks[PALM_CENTER].x
  const palmY = landmarks[PALM_CENTER].y

  // 更新滑动历史
  palmHistory.push({ x: palmX, y: palmY, time: now })
  palmHistory = palmHistory.filter((p) => now - p.time < SWIPE_HISTORY_MS)

  // ===== 张开手掌 (OPEN_PALM): 4-5 根手指伸展 =====
  if (extendedCount >= 4) {
    palmHistory = [] // 重置滑动历史
    return {
      type: 'open-palm',
      confidence: extendedCount / 5,
      landmarks,
    }
  }

  // ===== 握拳 (FIST): 0-1 根手指伸展 =====
  if (extendedCount <= 1) {
    // 确认不是过渡状态（持续检测）
    const fistConfidence = 1 - extendedCount / 5
    if (fistConfidence >= 0.8) {
      palmHistory = []
      return { type: 'fist', confidence: fistConfidence, landmarks }
    }
  }

  // ===== 食指指向 (POINT): 食指伸展，其余蜷缩 =====
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    palmHistory = []
    // 计算食指指向的屏幕位置
    const cursorX = (1 - landmarks[INDEX_TIP].x) * canvasWidth
    const cursorY = landmarks[INDEX_TIP].y * canvasHeight
    return {
      type: 'point',
      confidence: 0.9,
      landmarks,
      cursorPosition: { x: cursorX, y: cursorY },
    }
  }

  // ===== 滑动 (SWIPE): 手掌水平移动 =====
  if (palmHistory.length >= 3) {
    const first = palmHistory[0]
    const last = palmHistory[palmHistory.length - 1]
    const dx = last.x - first.x
    const dt = (last.time - first.time) / 1000 // 秒

    if (dt > 0) {
      const speed = Math.abs(dx) / dt
      const dist = Math.abs(dx)

      if (dist > SWIPE_MIN_DISTANCE && speed > SWIPE_MIN_SPEED) {
        return {
          type: 'swipe',
          confidence: Math.min(speed / 0.5, 1),
          landmarks,
        }
      }
    }
  }

  return { type: 'none', confidence: 0, landmarks }
}

/**
 * 重置手势检测状态（阶段切换时调用）
 */
export function resetGestureState(): void {
  palmHistory = []
}
