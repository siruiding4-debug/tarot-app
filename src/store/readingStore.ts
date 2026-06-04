import { create } from 'zustand'
import type { ReadingState, Phase, SpreadType, DrawnCard, ReadingRecord } from '@/types'
import { saveReadingRecord, generateRecordId } from '@/utils/storage'

export const useReadingStore = create<ReadingState>((set, get) => ({
  // 状态
  phase: 'landing',
  question: '',
  spreadType: null,
  drawnCards: [],
  readingHistory: [],
  isAudioEnabled: false,

  // 设置阶段
  setPhase: (phase: Phase) => set({ phase }),

  // 设置问题
  setQuestion: (q: string) => set({ question: q }),

  // 设置牌阵类型
  setSpreadType: (t: SpreadType) => set({ spreadType: t }),

  // 添加抽取的牌
  addDrawnCard: (card: DrawnCard) =>
    set((state) => ({
      drawnCards: [...state.drawnCards, card],
    })),

  // 翻牌
  revealCard: (position: number) =>
    set((state) => ({
      drawnCards: state.drawnCards.map((c) =>
        c.position === position ? { ...c, isRevealed: true } : c
      ),
    })),

  // 保存当前抽牌结果到历史
  saveReading: () => {
    const { question, spreadType, drawnCards } = get()
    if (!spreadType || drawnCards.length === 0) return

    const record: ReadingRecord = {
      id: generateRecordId(),
      timestamp: Date.now(),
      question: question || '宇宙的指引',
      spreadType,
      cards: drawnCards,
    }
    saveReadingRecord(record)
  },

  // 重置抽牌流程
  resetReading: () =>
    set({
      phase: 'landing',
      question: '',
      spreadType: null,
      drawnCards: [],
    }),

  // 切换音频
  toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),
}))
