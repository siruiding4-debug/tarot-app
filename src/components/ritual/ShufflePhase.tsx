import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import { useGesture } from '@/hooks/useGesture'
import WebcamFeed from '@/components/WebcamFeed'
import type { WebcamFeedHandle } from '@/components/WebcamFeed'

export default function ShufflePhase() {
  const setPhase = useReadingStore((s) => s.setPhase)
  const [shuffleCount, setShuffleCount] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const webcamRef = useRef<WebcamFeedHandle>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // 连接手势识别
  const { gesture, isModelReady } = useGesture({
    enabled: true,
    videoRef,
    canvasWidth: 640,
    canvasHeight: 480,
  })

  // 监听滑动手势 → 洗牌
  useEffect(() => {
    if (gesture.type === 'swipe') {
      setIsShuffling(true)
      setShuffleCount((c) => c + 1)
      // 重置空闲计时器
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setIsShuffling(false), 600)
    }
  }, [gesture.type])

  // 停止滑动 2 秒后自动进入切牌
  useEffect(() => {
    if (shuffleCount > 0 && !isShuffling) {
      const timer = setTimeout(() => setPhase('cut'), 2000)
      return () => clearTimeout(timer)
    }
  }, [isShuffling, shuffleCount, setPhase])

  // 连接 webcam video 元素到 hook
  useEffect(() => {
    if (webcamRef.current) {
      videoRef.current = webcamRef.current.getVideoElement()
    }
  }, [isModelReady])

  // 鼠标模拟洗牌
  const handleMouseShuffle = useCallback(() => {
    setIsShuffling(true)
    setShuffleCount((c) => c + 1)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setIsShuffling(false), 600)
  }, [])

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="font-mystic text-3xl text-glow-gold mb-2">洗牌</h2>
      <p className="text-text-dim text-sm mb-8">
        用手掌左右滑动来洗牌，注入你的能量
      </p>

      {/* 牌堆动画 */}
      <div
        className="relative w-64 h-80 mb-8 cursor-pointer"
        onMouseMove={handleMouseShuffle}
      >
        <AnimatePresence>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`${i}-${shuffleCount}`}
              className="absolute w-32 h-48 rounded-xl border border-gold-dark/40
                         bg-gradient-to-br from-bg-purple to-bg-deep"
              style={{
                left: `calc(50% - 64px + ${(i - 2) * 20}px)`,
                top: `${i * 3}px`,
                zIndex: 5 - i,
              }}
              initial={{ rotate: 0, x: 0 }}
              animate={
                isShuffling
                  ? {
                      rotate: [0, -15 + Math.random() * 30, 0],
                      x: [-30 + Math.random() * 60, 30 - Math.random() * 60, 0],
                      y: [-5, 5, -5],
                    }
                  : { rotate: 0, x: 0, y: 0 }
              }
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          ))}
        </AnimatePresence>

        {/* 背面图案 */}
        <div
          className="absolute w-32 h-48 rounded-xl border border-gold-dark/50
                         bg-gradient-to-br from-bg-purple to-bg-deep flex items-center justify-center"
          style={{ left: 'calc(50% - 64px)', top: 15, zIndex: 6 }}
        >
          <span className="text-4xl text-gold-dark/50 font-mystic">✧</span>
        </div>
      </div>

      {/* 洗牌次数 */}
      <p className="text-text-gold font-mystic text-lg mb-2">
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
        <p className="text-text-dim text-xs">移动手掌或滑动鼠标来洗牌</p>
      )}

      {/* 摄像头小窗 */}
      <div className="fixed bottom-6 right-6 z-20">
        <WebcamFeed
          ref={webcamRef}
          visible={true}
          size="sm"
          landmarks={gesture.landmarks}
        />
        {gesture.type !== 'none' && (
          <p className="text-glow-gold text-xs mt-1 text-center">
            {gesture.type === 'swipe' && '👋 检测到滑动'}
            {gesture.type === 'fist' && '✊ 检测到握拳'}
            {gesture.type === 'point' && '☝️ 检测到指向'}
            {gesture.type === 'open-palm' && '✋ 检测到张掌'}
          </p>
        )}
      </div>

      {/* 跳过 */}
      <button
        onClick={() => setPhase('cut')}
        className="mt-8 text-text-dim text-xs hover:text-text-gold transition-colors"
      >
        跳过洗牌 → 直接切牌
      </button>
    </motion.div>
  )
}
