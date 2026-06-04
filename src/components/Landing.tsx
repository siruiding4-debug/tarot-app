import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'

export default function Landing() {
  const setPhase = useReadingStore((s) => s.setPhase)

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-4 py-8 w-full h-full overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {/* 神秘符号 */}
      <motion.div
        className="text-6xl md:text-8xl mb-6 md:mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease: 'easeOut', type: 'spring' }}
      >
        🔮
      </motion.div>

      {/* 标题 */}
      <motion.h1
        className="font-mystic text-4xl md:text-7xl text-glow-gold mb-3 md:mb-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        神秘塔罗
      </motion.h1>

      {/* 副标题 */}
      <motion.p
        className="text-text-gold text-base md:text-lg mb-2 tracking-widest"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        命运之轮
      </motion.p>

      {/* 引导文字 */}
      <motion.p
        className="text-text-dim text-xs md:text-sm max-w-xs md:max-w-md mb-10 md:mb-12 leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
      >
        在静谧中感受能量的流动
        <br />
        用你的直觉，引导命运的指引
      </motion.p>

      {/* 进入按钮 */}
      <motion.button
        onClick={() => setPhase('question')}
        className="px-8 py-3 md:px-10 md:py-4 border-glow rounded-xl text-text-gold
                   font-mystic text-lg md:text-xl bg-bg-card
                   hover:bg-opacity-80 transition-all duration-500
                   hover:scale-105 hover:shadow-[0_0_30px_rgba(240,208,96,0.2)]
                   min-h-[44px]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        进入命运之轮
      </motion.button>

      {/* 历史记录入口 */}
      <motion.button
        onClick={() => setPhase('history')}
        className="mt-8 text-text-dim text-xs hover:text-text-gold transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        📜 查看历史记录
      </motion.button>
    </motion.div>
  )
}
