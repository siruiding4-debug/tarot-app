import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DrawnCard } from '@/types'

interface CardDisplayProps {
  drawnCard: DrawnCard
  index: number
}

export default function CardDisplay({ drawnCard, index }: CardDisplayProps) {
  const [expanded, setExpanded] = useState(false)
  const { card, orientation, positionName } = drawnCard
  const isUpright = orientation === 'upright'
  const meaning = isUpright ? card.meaningUp : card.meaningDown

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
    >
      <motion.div
        className={`rounded-2xl border p-4 md:p-6 cursor-pointer transition-all duration-300 ${
          expanded
            ? 'border-glow-gold shadow-[0_0_30px_rgba(240,208,96,0.2)] bg-bg-card'
            : 'border-gold-dark/20 hover:border-gold-dark/40 bg-bg-card/50'
        }`}
        onClick={() => setExpanded(!expanded)}
        whileTap={{ scale: 0.99 }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl">
              {card.arcana === 'major' ? '🔮' : '✦'}
            </span>
            <div>
              <h3 className="font-mystic text-base md:text-lg text-glow-gold">{card.name}</h3>
              <p className="text-text-dim text-[10px] md:text-xs">{card.nameEn}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span
              className={`text-[10px] md:text-xs px-2 py-1 rounded-full ${
                isUpright
                  ? 'bg-gold-dark/20 text-glow-gold'
                  : 'bg-violet/20 text-glow-purple'
              }`}
            >
              {isUpright ? '正位 ↑' : '逆位 ↓'}
            </span>
          </div>
        </div>

        <div className="divider-gold my-2" />
        <p className="text-text-dim text-xs mb-2">
          牌位：<span className="text-text-gold">{positionName}</span>
        </p>

        <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
          {card.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[10px] md:text-xs px-1.5 py-0.5 rounded-full bg-gold-dark/10
                         text-gold-dark border border-gold-dark/20"
            >
              {kw}
            </span>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {expanded && (
            <div className="pt-2 md:pt-3 space-y-2 md:space-y-3">
              <div>
                <h4 className="text-text-gold text-xs md:text-sm font-semibold mb-1">
                  {isUpright ? '正位含义' : '逆位含义'}
                </h4>
                <p className="text-text-gray text-xs md:text-sm leading-relaxed">{meaning}</p>
              </div>
              <div>
                <h4 className="text-text-gold text-xs md:text-sm font-semibold mb-1">
                  牌面描述
                </h4>
                <p className="text-text-dim text-[11px] md:text-xs leading-relaxed">
                  {card.description}
                </p>
              </div>
              {card.arcana === 'minor' && card.suit && (
                <div>
                  <h4 className="text-text-gold text-xs md:text-sm font-semibold mb-1">牌组</h4>
                  <p className="text-text-dim text-[11px] md:text-xs">
                    {
                      { wands: '权杖（火）', cups: '圣杯（水）', swords: '宝剑（风）', pentacles: '星币（土）' }[card.suit]
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <div className="text-center mt-2">
          <span className="text-text-dim text-[10px] md:text-xs">
            {expanded ? '点击收起 ▲' : '点击展开解读 ▼'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
