import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'

export default function QuestionInput() {
  const [question, setQuestion] = useState('')
  const setStoreQuestion = useReadingStore((s) => s.setQuestion)
  const setPhase = useReadingStore((s) => s.setPhase)

  const handleContinue = () => {
    setStoreQuestion(question.trim() || '宇宙的指引')
    setPhase('spread-select')
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 w-full max-w-sm md:max-w-lg py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-4xl md:text-5xl mb-4 md:mb-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🌙
      </motion.div>

      <h2 className="font-mystic text-2xl md:text-3xl text-glow-gold mb-2 md:mb-3">
        默想你的问题
      </h2>
      <p className="text-text-dim text-xs md:text-sm mb-6 md:mb-8 text-center leading-relaxed">
        问题越具体，牌意越清晰
        <br />
        也可以保持空灵，让宇宙指引你
      </p>

      <div className="w-full mb-6 md:mb-8">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="写下你心中的疑问..."
          rows={3}
          maxLength={200}
          className="w-full bg-bg-card border border-gold-dark/20 rounded-xl p-3 md:p-4
                     text-text-gold placeholder-text-dim/50 resize-none text-sm md:text-base
                     focus:outline-none focus:border-gold-dark/60 focus:shadow-[0_0_20px_rgba(201,168,76,0.1)]
                     transition-all duration-300"
        />
        <div className="text-right text-text-dim text-xs mt-1">
          {question.length}/200
        </div>
      </div>

      <motion.button
        onClick={handleContinue}
        className="px-8 py-3 border-glow rounded-xl text-text-gold font-mystic text-lg
                   bg-bg-card hover:bg-opacity-80 transition-all duration-300
                   hover:scale-105 min-h-[44px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        继续
      </motion.button>

      <button
        onClick={() => {
          setStoreQuestion('宇宙的指引')
          setPhase('spread-select')
        }}
        className="mt-4 text-text-dim text-xs hover:text-text-gold transition-colors"
      >
        跳过，让宇宙来决定
      </button>
    </motion.div>
  )
}
