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
      className="flex flex-col items-center justify-center px-6 w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-mystic text-3xl text-glow-gold mb-3">选择牌阵</h2>
      <p className="text-text-dim text-sm mb-10">不同的排列揭示不同的真相</p>

      {/* 牌阵选项网格 */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {spreads.map(({ type, icon, cards }, index) => {
          const def = getSpreadDefinition(type)
          return (
            <motion.button
              key={type}
              onClick={() => handleSelect(type)}
              className="relative flex flex-col items-center p-6 rounded-2xl
                         border border-gold-dark/20 bg-bg-card
                         hover:border-gold-dark/50 hover:shadow-[0_0_25px_rgba(201,168,76,0.15)]
                         transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 牌阵图标 */}
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {icon}
              </span>

              {/* 牌阵名称 */}
              <span className="font-mystic text-lg text-text-gold mb-1">
                {def.name}
              </span>

              {/* 牌数 */}
              <span className="text-text-dim text-xs mb-2">
                {def.cardCount} 张牌
              </span>

              {/* 描述 */}
              <span className="text-text-dim text-xs text-center leading-relaxed max-w-[200px]">
                {def.description}
              </span>

              {/* 牌位示意图 */}
              <div className="flex gap-1 mt-4 flex-wrap justify-center">
                {cards.map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-7 rounded border border-gold-dark/30
                               bg-bg-deep/50 group-hover:border-gold-dark/60
                               transition-all"
                  />
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* 返回按钮 */}
      <button
        onClick={() => setPhase('question')}
        className="mt-8 text-text-dim text-xs hover:text-text-gold transition-colors"
      >
        ← 返回修改问题
      </button>
    </motion.div>
  )
}
