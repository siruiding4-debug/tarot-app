import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'

export default function PreparationPhase() {
  const setPhase = useReadingStore((s) => s.setPhase)
  const [countdown, setCountdown] = useState(5)
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in')

  // 呼吸动画循环
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

  // 倒计时
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
      className="flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* 呼吸光环 */}
      <div className="relative mb-10 flex items-center justify-center">
        {/* 外环 */}
        <motion.div
          className="absolute w-48 h-48 rounded-full border border-gold-dark/20"
          animate={{
            scale: breathPhase === 'in' ? 1.4 : breathPhase === 'out' ? 0.9 : 1.4,
            opacity: breathPhase === 'in' ? 0.3 : breathPhase === 'out' ? 0.05 : 0.3,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        {/* 中环 */}
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-gold-dark/30"
          animate={{
            scale: breathPhase === 'in' ? 1.3 : breathPhase === 'out' ? 0.9 : 1.3,
            opacity: breathPhase === 'in' ? 0.5 : breathPhase === 'out' ? 0.1 : 0.5,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        {/* 核心光点 */}
        <motion.div
          className="w-16 h-16 rounded-full bg-glow-gold/20"
          animate={{
            scale: breathPhase === 'in' ? 1.5 : breathPhase === 'out' ? 0.8 : 1.5,
            opacity: breathPhase === 'in' ? 0.8 : breathPhase === 'out' ? 0.3 : 0.8,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        {/* 中心 */}
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-glow-gold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* 引导文字 */}
      <motion.div
        className="text-center"
        key={breathPhase}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mystic text-xl text-glow-gold mb-2">
          {breathLabel[breathPhase]}
        </p>
        <p className="text-text-dim text-sm">
          净化身心，建立与宇宙的连接
        </p>
      </motion.div>

      {/* 倒计时 */}
      <p className="text-text-dim text-xs mt-8">
        {countdown > 0 ? `${countdown} 秒后进入洗牌...` : '即将进入洗牌...'}
      </p>

      {/* 跳过按钮 */}
      <button
        onClick={() => setPhase('shuffle')}
        className="mt-4 text-text-dim text-xs hover:text-text-gold transition-colors"
      >
        跳过准备 →
      </button>
    </motion.div>
  )
}
