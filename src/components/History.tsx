import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReadingStore } from '@/store/readingStore'
import { getReadingHistory, deleteReadingRecord, clearReadingHistory } from '@/utils/storage'
import { getSpreadDefinition } from '@/utils/cardUtils'
import type { ReadingRecord } from '@/types'

export default function History() {
  const setPhase = useReadingStore((s) => s.setPhase)
  const [records, setRecords] = useState<ReadingRecord[]>([])

  useEffect(() => {
    setRecords(getReadingHistory())
  }, [])

  const handleDelete = (id: string) => {
    deleteReadingRecord(id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？')) {
      clearReadingHistory()
      setRecords([])
    }
  }

  const formatDate = (ts: number) => {
    const d = new Date(ts)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <motion.div
      className="flex flex-col items-center w-full h-full overflow-y-auto py-6 md:py-8 px-3 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="font-mystic text-2xl md:text-3xl text-glow-gold">历史记录</h2>
          <button
            onClick={() => setPhase('landing')}
            className="text-text-dim text-xs md:text-sm hover:text-text-gold transition-colors"
          >
            ← 返回
          </button>
        </div>

        {records.length === 0 ? (
          <motion.div
            className="text-center py-12 md:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-5xl md:text-6xl mb-3 md:mb-4 block">🔮</span>
            <p className="text-text-dim text-sm">还没有任何记录</p>
            <p className="text-text-dim text-xs mt-1 md:mt-2">进行第一次抽牌后，记录将在此显示</p>
            <button
              onClick={() => {
                useReadingStore.getState().resetReading()
                setPhase('landing')
              }}
              className="mt-5 md:mt-6 px-5 py-2.5 md:px-6 md:py-2 border-glow rounded-xl
                         text-text-gold font-mystic bg-bg-card hover:bg-opacity-80
                         transition-all min-h-[44px]"
            >
              开始抽牌
            </button>
          </motion.div>
        ) : (
          <>
            <div className="text-right mb-3 md:mb-4">
              <button
                onClick={handleClearAll}
                className="text-text-dim text-xs hover:text-red-400 transition-colors"
              >
                清空全部记录
              </button>
            </div>

            <div className="space-y-2 md:space-y-3">
              {records.map((record) => {
                const spreadDef = getSpreadDefinition(record.spreadType)
                return (
                  <motion.div
                    key={record.id}
                    className="rounded-xl border border-gold-dark/20 bg-bg-card p-3 md:p-4
                               hover:border-gold-dark/40 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between mb-1 md:mb-2">
                      <div>
                        <p className="text-text-gold text-xs md:text-sm font-mystic">
                          {spreadDef.name}
                        </p>
                        <p className="text-text-dim text-[10px] md:text-xs">
                          {formatDate(record.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-text-dim text-xs hover:text-red-400 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                    <p className="text-text-dim text-[10px] md:text-xs mb-1 md:mb-2">
                      问题：{record.question}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {record.cards.map((dc) => (
                        <span
                          key={dc.position}
                          className="text-[10px] md:text-xs px-1.5 py-0.5 rounded-full
                                     bg-gold-dark/10 text-gold-dark border border-gold-dark/20"
                        >
                          {dc.positionName}: {dc.card.name}
                          {dc.orientation === 'reversed' ? ' ↕' : ''}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        <p className="text-text-dim text-[10px] md:text-xs text-center mt-6 md:mt-8 opacity-50">
          记录保存在本地浏览器中，清除浏览器数据将丢失
        </p>
      </div>
    </motion.div>
  )
}
