import { useState } from 'react'

type Phase =
  | 'landing'
  | 'question'
  | 'spread-select'
  | 'preparation'
  | 'shuffle'
  | 'cut'
  | 'draw'
  | 'reveal'
  | 'result'

function App() {
  const [phase, setPhase] = useState<Phase>('landing')

  return (
    <div className="min-h-screen w-full bg-bg-deep flex flex-col items-center justify-center">
      {/* 占位：后续替换为各阶段组件 */}
      <h1 className="font-mystic text-5xl text-glow-gold mb-6">🔮 神秘塔罗</h1>
      <p className="text-text-gray mb-8">命运之轮，即将开启...</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {([
          'landing',
          'question',
          'spread-select',
          'preparation',
          'shuffle',
          'cut',
          'draw',
          'reveal',
          'result',
        ] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`px-4 py-2 rounded-lg text-sm transition-all border ${
              phase === p
                ? 'border-glow-gold text-glow-gold bg-bg-card'
                : 'border-gray-700 text-text-dim hover:border-gray-500'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <p className="mt-6 text-text-dim text-sm">
        当前阶段: <span className="text-glow-purple">{phase}</span>
      </p>
    </div>
  )
}

export default App
