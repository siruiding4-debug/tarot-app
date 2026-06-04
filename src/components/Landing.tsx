import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'

export default function Landing() {
  const setPhase = useReadingStore((s) => s.setPhase)

  const handleEnter = async () => {
    try {
      // 请求摄像头权限
      await navigator.mediaDevices.getUserMedia({ video: true })
      setPhase('question')
    } catch {
      // 摄像头不可用时仍然允许进入（手势功能会降级）
      setPhase('question')
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {/* 神秘符号 */}
      <motion.div
        className="text-8xl mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease: 'easeOut', type: 'spring' }}
      >
        🔮
      </motion.div>

      {/* 标题 */}
      <motion.h1
        className="font-mystic text-6xl md:text-7xl text-glow-gold mb-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        神秘塔罗
      </motion.h1>

      {/* 副标题 */}
      <motion.p
        className="text-text-gold text-lg mb-2 tracking-widest"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        命运之轮
      </motion.p>

      {/* 引导文字 */}
      <motion.p
        className="text-text-dim text-sm max-w-md mb-12 leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
      >
        在静谧中感受能量的流动
        <br />
        用你的双手，引导命运的指引
      </motion.p>

      {/* 进入按钮 */}
      <motion.button
        onClick={handleEnter}
        className="px-10 py-4 border-glow rounded-xl text-text-gold font-mystic text-xl
                   bg-bg-card hover:bg-opacity-80 transition-all duration-500
                   hover:scale-105 hover:shadow-[0_0_30px_rgba(240,208,96,0.2)]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        进入命运之轮
      </motion.button>

      {/* 底部提示 */}
      <motion.p
        className="text-text-dim text-xs mt-8 opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
      >
        请允许摄像头权限以获得完整体验
      </motion.p>
    </motion.div>
  )
}
