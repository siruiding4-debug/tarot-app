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
      {/* 牌面卡片 */}
      <motion.div
        className={`rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${
          expanded
            ? 'border-glow-gold shadow-[0_0_30px_rgba(240,208,96,0.2)] bg-bg-card'
            : 'border-gold-dark/20 hover:border-gold-dark/40 bg-bg-card/50'
        }`}
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.01 }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {card.arcana === 'major' ? '🔮' : '✦'}
            </span>
            <div>
              <h3 className="font-mystic text-lg text-glow-gold">{card.name}</h3>
              <p className="text-text-dim text-xs">{card.nameEn}</p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isUpright
                  ? 'bg-gold-dark/20 text-glow-gold'
                  : 'bg-violet/20 text-glow-purple'
              }`}
            >
              {isUpright ? '正位 ↑' : '逆位 ↓'}
            </span>
          </div>
        </div>

        {/* 牌阵位置 */}
        <div className="divider-gold my-2" />
        <p className="text-text-dim text-xs mb-2">
          牌位：<span className="text-text-gold">{positionName}</span>
        </p>

        {/* 关键词 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2 py-0.5 rounded-full bg-gold-dark/10
                         text-gold-dark border border-gold-dark/20"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* 展开的解读 */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {expanded && (
            <div className="pt-3 space-y-3">
              <div>
                <h4 className="text-text-gold text-sm font-semibold mb-1">
                  {isUpright ? '正位含义' : '逆位含义'}
                </h4>
                <p className="text-text-gray text-sm leading-relaxed">{meaning}</p>
              </div>
              <div>
                <h4 className="text-text-gold text-sm font-semibold mb-1">
                  牌面描述
                </h4>
                <p className="text-text-dim text-xs leading-relaxed">
                  {card.description}
                </p>
              </div>
              {card.arcana === 'minor' && card.suit && (
                <div>
                  <h4 className="text-text-gold text-sm font-semibold mb-1">
                    牌组
                  </h4>
                  <p className="text-text-dim text-xs">
                    {
                      { wands: '权杖（火）', cups: '圣杯（水）', swords: '宝剑（风）', pentacles: '星币（土）' }[card.suit]
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* 展开提示 */}
        <div className="text-center mt-2">
          <span className="text-text-dim text-xs">
            {expanded ? '点击收起 ▲' : '点击展开解读 ▼'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
