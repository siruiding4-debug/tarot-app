import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'

export default function CutPhase() {
  const setPhase = useReadingStore((s) => s.setPhase)
  const [cutState, setCutState] = useState<'ready' | 'cut' | 'stacked'>('ready')
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 自动演示切牌
  useEffect(() => {
    timerRef.current = setTimeout(() => setCutState('cut'), 1500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  useEffect(() => {
    if (cutState === 'cut') {
      timerRef.current = setTimeout(() => setCutState('stacked'), 1200)
    }
    if (cutState === 'stacked') {
      timerRef.current = setTimeout(() => setPhase('draw'), 1500)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [cutState, setPhase])

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="font-mystic text-3xl text-glow-gold mb-2">切牌</h2>
      <p className="text-text-dim text-sm mb-10">
        {cutState === 'ready' && '握拳或点击来切牌...'}
        {cutState === 'cut' && '牌堆已分开，正在重组...'}
        {cutState === 'stacked' && '能量已重新排列...'}
      </p>

      {/* 牌堆动画 */}
      <div className="relative w-64 h-60 mb-8">
        <AnimatePresence mode="wait">
          {cutState === 'ready' && (
            <motion.div
              key="stack"
              className="absolute left-1/2 top-0 -translate-x-1/2"
              exit={{ opacity: 0 }}
            >
              {/* 单一牌堆 */}
              <div className="w-32 h-48 rounded-xl border border-gold-dark/40
                              bg-gradient-to-br from-bg-purple to-bg-deep
                              flex items-center justify-center relative">
                <span className="text-3xl text-gold-dark/50 font-mystic">✧</span>
                {/* 牌堆厚度 */}
                <div className="absolute -bottom-1 left-1 w-32 h-48 rounded-xl
                                border border-gold-dark/20 bg-bg-purple/50 -z-10" />
                <div className="absolute -bottom-2 left-2 w-32 h-48 rounded-xl
                                border border-gold-dark/10 bg-bg-purple/30 -z-20" />
              </div>
            </motion.div>
          )}

          {cutState === 'cut' && (
            <motion.div
              key="split"
              className="flex gap-8 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 左叠 */}
              <motion.div
                className="w-24 h-36 rounded-xl border border-gold-dark/40
                           bg-gradient-to-br from-bg-purple to-bg-deep
                           flex items-center justify-center"
                initial={{ x: -60 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring' }}
              >
                <span className="text-2xl text-gold-dark/50">✦</span>
              </motion.div>
              {/* 中叠 */}
              <motion.div
                className="w-24 h-36 rounded-xl border border-gold-dark/40
                           bg-gradient-to-br from-bg-purple to-bg-deep
                           flex items-center justify-center"
                initial={{ y: -40 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring' }}
              >
                <span className="text-2xl text-gold-dark/50">✦</span>
              </motion.div>
              {/* 右叠 */}
              <motion.div
                className="w-24 h-36 rounded-xl border border-gold-dark/40
                           bg-gradient-to-br from-bg-purple to-bg-deep
                           flex items-center justify-center"
                initial={{ x: 60 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring' }}
              >
                <span className="text-2xl text-gold-dark/50">✦</span>
              </motion.div>
            </motion.div>
          )}

          {cutState === 'stacked' && (
            <motion.div
              key="restacked"
              className="absolute left-1/2 top-0 -translate-x-1/2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              {/* 重组后的牌堆 */}
              <motion.div
                className="w-32 h-48 rounded-xl border border-glow-gold
                           bg-gradient-to-br from-bg-purple to-bg-deep
                           flex items-center justify-center
                           shadow-[0_0_20px_rgba(240,208,96,0.2)]"
              >
                <span className="text-3xl text-glow-gold font-mystic">✧</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 状态提示 */}
      <motion.div
        className="w-48 h-0.5 bg-gradient-to-r from-transparent via-gold-dark/40 to-transparent"
        animate={{
          opacity: cutState === 'stacked' ? 1 : 0.3,
        }}
      />

      {/* 跳过 */}
      <button
        onClick={() => setPhase('draw')}
        className="mt-8 text-text-dim text-xs hover:text-text-gold transition-colors"
      >
        跳过切牌 → 直接抽牌
      </button>
    </motion.div>
  )
}
