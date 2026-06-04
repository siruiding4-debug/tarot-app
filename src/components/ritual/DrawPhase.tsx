import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import { useGesture } from '@/hooks/useGesture'
import { shuffleDeck, assignDrawnCards } from '@/utils/cardUtils'
import WebcamFeed from '@/components/WebcamFeed'
import type { WebcamFeedHandle } from '@/components/WebcamFeed'
import type { TarotCard } from '@/types'

const FAN_CARDS = 15 // 扇形展示 15 张候选牌

export default function DrawPhase() {
  const spreadType = useReadingStore((s) => s.spreadType)
  const addDrawnCard = useReadingStore((s) => s.addDrawnCard)
  const setPhase = useReadingStore((s) => s.setPhase)

  const [fanCards, setFanCards] = useState<TarotCard[]>([])
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const webcamRef = useRef<WebcamFeedHandle>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const neededCards = spreadType ? { single: 1, 'three-card': 3, triangle: 3, 'celtic-cross': 10 }[spreadType] : 3
  const remaining = neededCards - selectedIndices.length

  // 初始化：洗牌并生成扇形候选牌
  useEffect(() => {
    const deck = shuffleDeck()
    setFanCards(deck.slice(0, FAN_CARDS))
  }, [])

  // 连接手势
  const { gesture } = useGesture({
    enabled: true,
    videoRef,
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
  })

  useEffect(() => {
    if (webcamRef.current) {
      videoRef.current = webcamRef.current.getVideoElement()
    }
  }, [])

  // 选择一张牌
  const selectCard = useCallback(
    (index: number) => {
      if (isProcessing || selectedIndices.includes(index)) return
      if (remaining <= 0) return

      setIsProcessing(true)
      setSelectedIndices((prev) => [...prev, index])

      const card = fanCards[index]
      const drawn = assignDrawnCards([card], spreadType!)
      addDrawnCard({ ...drawn[0], position: selectedIndices.length })

      setTimeout(() => setIsProcessing(false), 600)

      // 检查是否抽够了
      if (selectedIndices.length + 1 >= neededCards) {
        setTimeout(() => setPhase('reveal'), 1200)
      }
    },
    [isProcessing, selectedIndices, remaining, fanCards, spreadType, addDrawnCard, neededCards, setPhase]
  )

  // 手势悬停选牌
  useEffect(() => {
    if (gesture.type === 'point' && gesture.cursorPosition && !isProcessing) {
      const { x, y } = gesture.cursorPosition
      // 检查是否悬停在某张牌上（牌在页面中下部排列）
      const cardWidth = window.innerWidth / (FAN_CARDS + 2)
      const centerX = window.innerWidth / 2
      const cardStartX = centerX - (FAN_CARDS * cardWidth) / 2
      const cardY = window.innerHeight * 0.45
      const cardHeight = 200

      const hoveredIdx = Math.floor((x - cardStartX) / cardWidth)
      if (
        hoveredIdx >= 0 &&
        hoveredIdx < FAN_CARDS &&
        y > cardY &&
        y < cardY + cardHeight &&
        !selectedIndices.includes(hoveredIdx)
      ) {
        setHoveredIndex(hoveredIdx)
      } else {
        setHoveredIndex(null)
      }
    }
  }, [gesture, isProcessing, selectedIndices])

  if (!spreadType) return null

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-mystic text-3xl text-glow-gold mb-2">抽牌</h2>
      <p className="text-text-dim text-sm mb-2">
        凭直觉选择 {neededCards} 张牌
      </p>
      <p className="text-glow-purple text-lg font-mystic mb-8">
        还需抽取 {remaining} 张
      </p>

      {/* 扇形牌面 */}
      <div className="relative w-full max-w-5xl h-56 flex items-end justify-center">
        {fanCards.map((card, index) => {
          const isSelected = selectedIndices.includes(index)
          const isHovered = hoveredIndex === index
          const fanAngle = ((index - (FAN_CARDS - 1) / 2) / (FAN_CARDS - 1)) * 40

          return (
            <motion.div
              key={`${card.id}-${index}`}
              className={`absolute w-20 h-32 rounded-lg border cursor-pointer
                         bg-gradient-to-br from-bg-purple to-bg-deep
                         flex items-center justify-center
                         ${isSelected ? 'border-glow-gold shadow-[0_0_15px_rgba(240,208,96,0.3)]' : 'border-gold-dark/30 hover:border-gold-dark/60'}
                         ${isHovered ? 'border-glow-purple shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-110' : ''}
                         transition-all duration-300`}
              style={{
                left: `${((index + 0.5) / FAN_CARDS) * 100}%`,
                bottom: `${Math.abs(fanAngle) * 0.4}px`,
                transform: `translateX(-50%) rotate(${fanAngle}deg)`,
                zIndex: isSelected || isHovered ? 20 : Math.abs(fanAngle) < 10 ? 10 : 5,
                opacity: isSelected ? 0.3 : 1,
              }}
              animate={
                isSelected
                  ? { y: -40, opacity: 0, scale: 0.8 }
                  : isHovered
                  ? { y: -15 }
                  : { y: 0 }
              }
              onClick={() => selectCard(index)}
              whileHover={!isSelected ? { y: -10, scale: 1.1 } : {}}
            >
              <span className="text-2xl text-gold-dark/60 font-mystic">✧</span>
              {isSelected && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-glow-gold text-4xl">✓</span>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* 已选牌显示 */}
      {selectedIndices.length > 0 && (
        <div className="flex gap-2 mt-8">
          {selectedIndices.map((_, i) => (
            <motion.div
              key={i}
              className="w-12 h-16 rounded border border-gold-dark/40
                         bg-bg-card flex items-center justify-center"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
            >
              <span className="text-xs text-gold-dark font-mystic">{i + 1}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* 摄像头 */}
      <div className="fixed bottom-6 right-6 z-20">
        <WebcamFeed
          ref={webcamRef}
          visible={true}
          size="sm"
          landmarks={gesture.landmarks}
        />
      </div>
    </motion.div>
  )
}
