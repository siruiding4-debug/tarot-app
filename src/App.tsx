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
import ReadingResult from '@/components/ReadingResult'
import History from '@/components/History'

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
        return <ReadingResult key="result" />
      case 'history':
        return <History key="history" />
      default:
        return <Landing key="landing" />
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-bg-deep">
      <MysticBackground />
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">{renderPhase()}</AnimatePresence>
      </div>
    </div>
  )
}

export default App
