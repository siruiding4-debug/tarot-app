import type { ReadingRecord } from '@/types'

const STORAGE_KEY = 'tarot-reading-history'
const MAX_RECORDS = 50 // 最多保存 50 条记录

/**
 * 读取全部历史记录
 */
export function getReadingHistory(): ReadingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data as ReadingRecord[]
  } catch {
    // 数据损坏时清除并返回空数组
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

/**
 * 保存一条抽牌记录
 * 最新的记录排在最前面，超出上限时删除最旧的
 */
export function saveReadingRecord(record: ReadingRecord): void {
  try {
    const history = getReadingHistory()
    history.unshift(record) // 最新在前
    if (history.length > MAX_RECORDS) {
      history.splice(MAX_RECORDS)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    console.warn('无法保存历史记录，localStorage 可能已满')
  }
}

/**
 * 删除指定记录
 */
export function deleteReadingRecord(id: string): void {
  try {
    const history = getReadingHistory()
    const filtered = history.filter((r) => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    console.warn('无法删除历史记录')
  }
}

/**
 * 清空全部历史记录
 */
export function clearReadingHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    console.warn('无法清空历史记录')
  }
}

/**
 * 生成唯一记录 ID
 */
export function generateRecordId(): string {
  return `tarot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
