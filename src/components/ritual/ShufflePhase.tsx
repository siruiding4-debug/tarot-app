import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'

export default function ShufflePhase() {
  const setPhase = useReadingStore((s) => s.setPhase)
  const [shuffleCount, setShuffleCount] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 停止滑动 2 秒后自动进入切牌
  useEffect(() => {
    if (shuffleCount > 0 && !isShuffling) {
      const timer = setTimeout(() => setPhase('cut'), 2000)
      return () => clearTimeout(timer)
    }
  }, [isShuffling, shuffleCount, setPhase])

  // 触发洗牌（点击或触摸滑动）
  const handleShuffle = useCallback(() => {
    setIsShuffling(true)
    setShuffleCount((c) => c + 1)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setIsShuffling(false), 600)
  }, [])

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 w-full h-full overflow-y-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="font-mystic text-2xl md:text-3xl text-glow-gold mb-2">洗牌</h2>
      <p className="text-text-dim text-xs md:text-sm mb-6 md:mb-8 text-center">
        滑动或点击牌堆来洗牌，注入你的能量
      </p>

      {/* 牌堆动画 */}
      <div
        className="relative w-48 h-60 md:w-64 md:h-80 mb-6 md:mb-8 cursor-pointer touch-pan-y"
        onMouseMove={handleShuffle}
        onTouchMove={handleShuffle}
        onClick={handleShuffle}
      >
        <AnimatePresence>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`${i}-${shuffleCount}`}
              className="absolute w-24 h-36 md:w-32 md:h-48 rounded-xl border border-gold-dark/40
                         bg-linear-to-br from-bg-purple to-bg-deep"
              style={{
                left: `calc(50% - 48px + ${(i - 2) * 15}px)`,
                top: `${i * 2}px`,
                zIndex: 5 - i,
              }}
              initial={{ rotate: 0, x: 0 }}
              animate={
                isShuffling
                  ? {
                      rotate: [0, -15 + Math.random() * 30, 0],
                      x: [-20 + Math.random() * 40, 20 - Math.random() * 40, 0],
                      y: [-3, 3, -3],
                    }
                  : { rotate: 0, x: 0, y: 0 }
              }
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          ))}
        </AnimatePresence>

        {/* 背面图案 */}
        <div
          className="absolute w-24 h-36 md:w-32 md:h-48 rounded-xl border border-gold-dark/50
                     bg-linear-to-br from-bg-purple to-bg-deep flex items-center justify-center"
          style={{ left: 'calc(50% - 48px)', top: 10, zIndex: 6 }}
        >
          <span className="text-3xl md:text-4xl text-gold-dark/50 font-mystic">✧</span>
        </div>
      </div>

      {/* 洗牌次数 */}
      <p className="text-text-gold font-mystic text-base md:text-lg mb-2">
        已洗牌 {shuffleCount} 次
      </p>
      {shuffleCount > 0 && !isShuffling && (
        <motion.p
          className="text-text-dim text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          即将自动进入切牌...
        </motion.p>
      )}
      {shuffleCount === 0 && (
        <p className="text-text-dim text-xs">点击或滑动牌堆开始洗牌</p>
      )}

      {/* 继续按钮 */}
      {shuffleCount > 0 && (
        <motion.button
          onClick={() => setPhase('cut')}
          className="mt-6 px-6 py-2.5 border-glow rounded-xl text-text-gold font-mystic
                     bg-bg-card hover:bg-opacity-80 transition-all min-h-[44px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.98 }}
        >
          完成洗牌，进入切牌 →
        </motion.button>
      )}
    </motion.div>
  )
}
