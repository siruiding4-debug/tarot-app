import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import { getSpreadDefinition } from '@/utils/cardUtils'
import CardDisplay from '@/components/CardDisplay'

export default function ReadingResult() {
  const drawnCards = useReadingStore((s) => s.drawnCards)
  const question = useReadingStore((s) => s.question)
  const spreadType = useReadingStore((s) => s.spreadType)
  const saveReading = useReadingStore((s) => s.saveReading)
  const resetReading = useReadingStore((s) => s.resetReading)
  const setPhase = useReadingStore((s) => s.setPhase)

  const spreadDef = spreadType ? getSpreadDefinition(spreadType) : null

  // 自动保存
  useEffect(() => {
    saveReading()
  }, [])

  return (
    <motion.div
      className="flex flex-col items-center w-full h-full overflow-y-auto py-8 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 标题 */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="font-mystic text-4xl text-glow-gold mb-2">命运之示</h2>
        {spreadDef && (
          <p className="text-text-gold text-lg font-mystic">{spreadDef.name}</p>
        )}
        <p className="text-text-dim text-sm mt-1">
          你的问题：{question || '宇宙的指引'}
        </p>
      </motion.div>

      {/* 牌阵解读 */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xl mb-10">
        {drawnCards.map((dc, index) => (
          <CardDisplay key={index} drawnCard={dc} index={index} />
        ))}
      </div>

      {/* 整体总结 */}
      {spreadDef && (
        <motion.div
          className="w-full max-w-xl rounded-2xl border border-gold-dark/30 bg-bg-card p-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="font-mystic text-xl text-glow-gold mb-4 text-center">
            整体解读
          </h3>
          <div className="space-y-3">
            {drawnCards.map((dc) => (
              <div key={dc.position} className="flex items-start gap-3 text-sm">
                <span className="text-gold-dark font-mystic min-w-[3rem]">
                  {dc.positionName}
                </span>
                <span className="text-text-gray">
                  {dc.card.name}
                  {dc.orientation === 'reversed' ? '（逆位）' : ''} —{' '}
                  {dc.card.keywords.slice(0, 3).join('、')}
                </span>
              </div>
            ))}
          </div>
          <div className="divider-gold my-4" />
          <p className="text-text-dim text-xs text-center leading-relaxed">
            每张牌都是宇宙给你的礼物。它们从不同角度揭示了命运的纹理。
            请记住，塔罗牌是指引而非命运——你的选择永远掌握在自己手中。✨
          </p>
        </motion.div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4 flex-wrap justify-center">
        <motion.button
          onClick={resetReading}
          className="px-6 py-2.5 border-glow rounded-xl text-text-gold font-mystic
                     bg-bg-card hover:bg-opacity-80 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          重新抽牌
        </motion.button>
        <motion.button
          onClick={() => setPhase('history')}
          className="px-6 py-2.5 border border-gold-dark/20 rounded-xl
                     text-text-dim hover:text-text-gold hover:border-gold-dark/40
                     transition-all text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          查看历史记录
        </motion.button>
      </div>
    </motion.div>
  )
}
