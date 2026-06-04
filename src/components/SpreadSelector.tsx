import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import { getSpreadDefinition } from '@/utils/cardUtils'
import type { SpreadType } from '@/types'

const spreads: { type: SpreadType; icon: string; cards: number[] }[] = [
  { type: 'single', icon: '✦', cards: [0] },
  { type: 'three-card', icon: '☽', cards: [0, 1, 2] },
  { type: 'triangle', icon: '△', cards: [0, 1, 2] },
  { type: 'celtic-cross', icon: '✧', cards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
]

export default function SpreadSelector() {
  const setSpreadType = useReadingStore((s) => s.setSpreadType)
  const setPhase = useReadingStore((s) => s.setPhase)

  const handleSelect = (type: SpreadType) => {
    setSpreadType(type)
    setPhase('preparation')
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-3 w-full max-w-lg py-6 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-mystic text-2xl md:text-3xl text-glow-gold mb-2 md:mb-3">
        选择牌阵
      </h2>
      <p className="text-text-dim text-xs md:text-sm mb-6 md:mb-8">
        不同的排列揭示不同的真相
      </p>

      {/* 移动端单列，桌面端双列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
        {spreads.map(({ type, icon, cards }, index) => {
          const def = getSpreadDefinition(type)
          return (
            <motion.button
              key={type}
              onClick={() => handleSelect(type)}
              className="relative flex flex-col items-center p-4 md:p-6 rounded-2xl
                         border border-gold-dark/20 bg-bg-card
                         hover:border-gold-dark/50 hover:shadow-[0_0_25px_rgba(201,168,76,0.15)]
                         transition-all duration-300 group min-h-[44px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                {icon}
              </span>
              <span className="font-mystic text-base md:text-lg text-text-gold mb-1">
                {def.name}
              </span>
              <span className="text-text-dim text-xs mb-1 md:mb-2">
                {def.cardCount} 张牌
              </span>
              <span className="text-text-dim text-xs text-center leading-relaxed max-w-[200px]">
                {def.description}
              </span>
              <div className="flex gap-1 mt-3 md:mt-4 flex-wrap justify-center">
                {cards.map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-6 md:w-5 md:h-7 rounded border border-gold-dark/30
                               bg-bg-deep/50 group-hover:border-gold-dark/60
                               transition-all"
                  />
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={() => setPhase('question')}
        className="mt-6 md:mt-8 text-text-dim text-xs hover:text-text-gold transition-colors"
      >
        ← 返回修改问题
      </button>
    </motion.div>
  )
}
