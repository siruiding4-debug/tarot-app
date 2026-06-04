import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import { shuffleDeck, assignDrawnCards } from '@/utils/cardUtils'
import type { TarotCard } from '@/types'

export default function DrawPhase() {
  const spreadType = useReadingStore((s) => s.spreadType)
  const addDrawnCard = useReadingStore((s) => s.addDrawnCard)
  const setPhase = useReadingStore((s) => s.setPhase)

  const [fanCards, setFanCards] = useState<TarotCard[]>([])
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const neededCards = spreadType
    ? { single: 1, 'three-card': 3, triangle: 3, 'celtic-cross': 10 }[spreadType]
    : 3
  const remaining = neededCards - selectedIndices.length

  // 初始化：洗牌生成候选牌
  useEffect(() => {
    const deck = shuffleDeck()
    setFanCards(deck.slice(0, 18))
  }, [])

  // 选择一张牌
  const selectCard = useCallback(
    (index: number) => {
      if (isProcessing || selectedIndices.includes(index)) return
      if (remaining <= 0) return

      setIsProcessing(true)
      setSelectedIndices((prev) => [...prev, index])

      const card = fanCards[index]
      const drawn = assignDrawnCards([card], spreadType!)
      addDrawnCard({ ...drawn[0], position: selectedIndices.length })

      setTimeout(() => setIsProcessing(false), 500)

      if (selectedIndices.length + 1 >= neededCards) {
        setTimeout(() => setPhase('reveal'), 1000)
      }
    },
    [isProcessing, selectedIndices, remaining, fanCards, spreadType, addDrawnCard, neededCards, setPhase]
  )

  if (!spreadType) return null

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-3 w-full h-full overflow-y-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-mystic text-2xl md:text-3xl text-glow-gold mb-1">抽牌</h2>
      <p className="text-text-dim text-xs md:text-sm mb-1">
        凭直觉选择 {neededCards} 张牌
      </p>
      <p className="text-glow-purple text-base md:text-lg font-mystic mb-4 md:mb-6">
        还需抽取 {remaining} 张
      </p>

      {/* 牌面网格（移动端 3 列，桌面端 6 列） */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 max-w-lg mx-auto mb-6">
        {fanCards.map((card, index) => {
          const isSelected = selectedIndices.includes(index)
          return (
            <motion.button
              key={`${card.id}-${index}`}
              onClick={() => selectCard(index)}
              disabled={isSelected}
              className={`w-20 h-28 md:w-24 md:h-36 rounded-lg border flex items-center justify-center
                         transition-all duration-300 min-h-[44px] min-w-[44px]
                         ${isSelected
                           ? 'border-glow-gold bg-bg-card/30 opacity-30 scale-90'
                           : 'border-gold-dark/30 bg-linear-to-br from-bg-purple to-bg-deep hover:border-gold-dark/60 active:scale-95'
                         }`}
              animate={
                isSelected
                  ? { scale: 0.9, opacity: 0.3 }
                  : { scale: 1, opacity: 1 }
              }
              whileHover={!isSelected ? { scale: 1.05, y: -4 } : {}}
              whileTap={!isSelected ? { scale: 0.95 } : {}}
            >
              <span className="text-xl md:text-2xl text-gold-dark/60 font-mystic">✧</span>
              {isSelected && (
                <motion.span
                  className="absolute text-glow-gold text-2xl md:text-3xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* 已选牌预览 */}
      {selectedIndices.length > 0 && (
        <div className="flex gap-1.5 md:gap-2">
          {selectedIndices.map((_, i) => (
            <motion.div
              key={i}
              className="w-10 h-14 md:w-12 md:h-16 rounded border border-gold-dark/40
                         bg-bg-card flex items-center justify-center"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
            >
              <span className="text-xs text-gold-dark font-mystic">{i + 1}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
