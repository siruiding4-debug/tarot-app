import { useReadingStore } from '@/store/readingStore'
import MysticBackground from '@/components/MysticBackground'
import Landing from '@/components/Landing'

function App() {
  const phase = useReadingStore((s) => s.phase)

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-deep">
      {/* 神秘粒子背景 */}
      <MysticBackground />

      {/* 主内容层 */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {phase === 'landing' && <Landing />}
        {/* 其他阶段组件将在后续步骤中添加 */}
      </div>
    </div>
  )
}

export default App
