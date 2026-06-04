import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'

export default function PreparationPhase() {
  const setPhase = useReadingStore((s) => s.setPhase)
  const [countdown, setCountdown] = useState(5)
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const cycle = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'in') return 'hold'
        if (prev === 'hold') return 'out'
        return 'in'
      })
    }, 3000)
    return () => clearInterval(cycle)
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      setPhase('shuffle')
      return
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1200)
    return () => clearInterval(timer)
  }, [countdown, setPhase])

  const breathLabel = {
    in: '深吸气...感受能量流入',
    hold: '屏住呼吸...让能量沉淀',
    out: '缓缓呼出...释放所有杂念',
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-8 w-full h-full overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* 呼吸光环 */}
      <div className="relative mb-8 md:mb-10 flex items-center justify-center">
        <motion.div
          className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border border-gold-dark/20"
          animate={{
            scale: breathPhase === 'in' ? 1.4 : breathPhase === 'out' ? 0.9 : 1.4,
            opacity: breathPhase === 'in' ? 0.3 : breathPhase === 'out' ? 0.05 : 0.3,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border border-gold-dark/30"
          animate={{
            scale: breathPhase === 'in' ? 1.3 : breathPhase === 'out' ? 0.9 : 1.3,
            opacity: breathPhase === 'in' ? 0.5 : breathPhase === 'out' ? 0.1 : 0.5,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-glow-gold/20"
          animate={{
            scale: breathPhase === 'in' ? 1.5 : breathPhase === 'out' ? 0.8 : 1.5,
            opacity: breathPhase === 'in' ? 0.8 : breathPhase === 'out' ? 0.3 : 0.8,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full bg-glow-gold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="text-center"
        key={breathPhase}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mystic text-lg md:text-xl text-glow-gold mb-2">
          {breathLabel[breathPhase]}
        </p>
        <p className="text-text-dim text-xs md:text-sm">
          净化身心，建立与宇宙的连接
        </p>
      </motion.div>

      <p className="text-text-dim text-xs mt-6 md:mt-8">
        {countdown > 0 ? `${countdown} 秒后进入洗牌...` : '即将进入洗牌...'}
      </p>

      <button
        onClick={() => setPhase('shuffle')}
        className="mt-4 text-text-dim text-xs hover:text-text-gold transition-colors min-h-[44px]"
      >
        跳过准备 →
      </button>
    </motion.div>
  )
}
