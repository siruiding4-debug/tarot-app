import { AnimatePresence } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import MysticBackground from '@/components/MysticBackground'
import Landing from '@/components/Landing'
import QuestionInput from '@/components/QuestionInput'
import SpreadSelector from '@/components/SpreadSelector'
import PreparationPhase from '@/components/ritual/PreparationPhase'
import ShufflePhase from '@/components/ritual/ShufflePhase'
import CutPhase from '@/components/ritual/CutPhase'
import DrawPhase from '@/components/ritual/DrawPhase'
import RevealPhase from '@/components/ritual/RevealPhase'

function App() {
  const phase = useReadingStore((s) => s.phase)

  const renderPhase = () => {
    switch (phase) {
      case 'landing':
        return <Landing key="landing" />
      case 'question':
        return <QuestionInput key="question" />
      case 'spread-select':
        return <SpreadSelector key="spread-select" />
      case 'preparation':
        return <PreparationPhase key="preparation" />
      case 'shuffle':
        return <ShufflePhase key="shuffle" />
      case 'cut':
        return <CutPhase key="cut" />
      case 'draw':
        return <DrawPhase key="draw" />
      case 'reveal':
        return <RevealPhase key="reveal" />
      case 'result':
        // 将在 Step 6 中实现
        return (
          <div key="result" className="flex flex-col items-center justify-center">
            <h2 className="font-mystic text-3xl text-glow-gold">解读结果</h2>
            <p className="text-text-dim mt-4">即将在下一步实现...</p>
          </div>
        )
      default:
        return <Landing key="landing" />
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-deep">
      <MysticBackground />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">{renderPhase()}</AnimatePresence>
      </div>
    </div>
  )
}

export default App
