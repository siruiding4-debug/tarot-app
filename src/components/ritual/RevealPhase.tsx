import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import { useGesture } from '@/hooks/useGesture'
import WebcamFeed from '@/components/WebcamFeed'
import type { WebcamFeedHandle } from '@/components/WebcamFeed'

export default function RevealPhase() {
  const drawnCards = useReadingStore((s) => s.drawnCards)
  const revealCard = useReadingStore((s) => s.revealCard)
  const setPhase = useReadingStore((s) => s.setPhase)
  const [revealIndex, setRevealIndex] = useState(0)
  const [showParticles, setShowParticles] = useState(false)

  const webcamRef = useRef<WebcamFeedHandle>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const allRevealed = revealIndex >= drawnCards.length

  // 连接手势
  const { gesture } = useGesture({
    enabled: !allRevealed,
    videoRef,
    canvasWidth: 640,
    canvasHeight: 480,
  })

  useEffect(() => {
    if (webcamRef.current) {
      videoRef.current = webcamRef.current.getVideoElement()
    }
  }, [])

  // 检测张开手掌 → 翻牌
  useEffect(() => {
    if (gesture.type === 'open-palm' && !allRevealed) {
      revealNextCard()
    }
  }, [gesture.type])

  // 翻下一张牌
  const revealNextCard = () => {
    if (revealIndex >= drawnCards.length) {
      setTimeout(() => setPhase('result'), 1500)
      return
    }
    revealCard(revealIndex)
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 800)
    setRevealIndex((i) => i + 1)
  }

  // 全部翻完后自动进入结果
  useEffect(() => {
    if (allRevealed) {
      const timer = setTimeout(() => setPhase('result'), 2000)
      return () => clearTimeout(timer)
    }
  }, [allRevealed, setPhase])

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-mystic text-3xl text-glow-gold mb-2">揭示命运</h2>
      <p className="text-text-dim text-sm mb-8">
        {allRevealed
          ? '所有牌已翻开，命运已经显现...'
          : `张开手掌来翻开第 ${revealIndex + 1} 张牌`}
      </p>

      {/* 牌面排列 */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {drawnCards.map((dc, index) => (
          <motion.div
            key={index}
            className="relative w-32 h-48 perspective-1000 cursor-pointer"
            onClick={() => {
              if (!dc.isRevealed) {
                revealCard(index)
                setShowParticles(true)
                setTimeout(() => setShowParticles(false), 800)
                setRevealIndex((i) => Math.max(i, index + 1))
              }
            }}
          >
            {/* 牌面翻转 */}
            <motion.div
              className="relative w-full h-full"
              animate={{ rotateY: dc.isRevealed ? 180 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 正面（牌背） */}
              <div
                className="absolute inset-0 rounded-xl border border-gold-dark/40
                           bg-gradient-to-br from-bg-purple to-bg-deep
                           flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-3xl text-gold-dark/50 font-mystic">✧</span>
                <span className="absolute bottom-3 text-xs text-text-dim">
                  {dc.positionName}
                </span>
              </div>

              {/* 背面（牌面内容） */}
              <div
                className="absolute inset-0 rounded-xl border border-glow-gold
                           bg-gradient-to-br from-bg-purple/80 to-bg-deep/80
                           flex flex-col items-center justify-center p-3"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="text-2xl mb-1">
                  {dc.card.arcana === 'major' ? '🔮' : '✦'}
                </span>
                <span className="font-mystic text-sm text-glow-gold text-center leading-tight">
                  {dc.card.name}
                </span>
                <span className="text-[10px] text-text-dim mt-1">
                  {dc.orientation === 'upright' ? '正位 ↑' : '逆位 ↓'}
                </span>
              </div>
            </motion.div>

            {/* 翻牌粒子 */}
            <AnimatePresence>
              {showParticles && dc.isRevealed && index === revealIndex - 1 && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-glow-gold"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((i / 8) * Math.PI * 2) * 60,
                        y: Math.sin((i / 8) * Math.PI * 2) * 60,
                        opacity: 0,
                        scale: 0,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 手动翻牌按钮 */}
      {!allRevealed && (
        <motion.button
          onClick={revealNextCard}
          className="px-6 py-2 border-glow rounded-xl text-text-gold font-mystic
                     bg-bg-card hover:bg-opacity-80 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          点击翻开第 {revealIndex + 1} 张牌
        </motion.button>
      )}

      {allRevealed && (
        <motion.p
          className="text-glow-gold font-mystic text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          命运已揭晓...
        </motion.p>
      )}

      {/* 摄像头 */}
      <div className="fixed bottom-6 right-6 z-20">
        <WebcamFeed
          ref={webcamRef}
          visible={!allRevealed}
          size="sm"
          landmarks={gesture.landmarks}
        />
      </div>
    </motion.div>
  )
}
