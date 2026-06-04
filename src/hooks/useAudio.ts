import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'

// 音频资源路径（使用占位，实际部署时替换为真实音频文件）
const AUDIO = {
  bgm: '/audio/bgm-ambient.mp3',
  shuffle: '/audio/shuffle.mp3',
  cardFlip: '/audio/card-flip.mp3',
  reveal: '/audio/reveal.mp3',
}

interface AudioController {
  playBgm: () => void
  stopBgm: () => void
  playShuffle: () => void
  playCardFlip: () => void
  playReveal: () => void
}

/**
 * 音频管理 Hook
 * 管理背景音乐和音效的播放
 */
export function useAudio(enabled = false): AudioController {
  const bgmRef = useRef<Howl | null>(null)
  const shuffleRef = useRef<Howl | null>(null)
  const flipRef = useRef<Howl | null>(null)
  const revealRef = useRef<Howl | null>(null)

  // 初始化音频实例
  useEffect(() => {
    bgmRef.current = new Howl({
      src: [AUDIO.bgm],
      loop: true,
      volume: 0.15,
      preload: true,
    })

    shuffleRef.current = new Howl({
      src: [AUDIO.shuffle],
      volume: 0.3,
      preload: true,
    })

    flipRef.current = new Howl({
      src: [AUDIO.cardFlip],
      volume: 0.4,
      preload: true,
    })

    revealRef.current = new Howl({
      src: [AUDIO.reveal],
      volume: 0.5,
      preload: true,
    })

    return () => {
      bgmRef.current?.unload()
      shuffleRef.current?.unload()
      flipRef.current?.unload()
      revealRef.current?.unload()
    }
  }, [])

  const playBgm = useCallback(() => {
    if (!enabled || !bgmRef.current) return
    if (!bgmRef.current.playing()) {
      bgmRef.current.play()
    }
  }, [enabled])

  const stopBgm = useCallback(() => {
    bgmRef.current?.stop()
  }, [])

  const playShuffle = useCallback(() => {
    if (!enabled || !shuffleRef.current) return
    if (!shuffleRef.current.playing()) {
      shuffleRef.current.play()
    }
  }, [enabled])

  const playCardFlip = useCallback(() => {
    if (!enabled || !flipRef.current) return
    flipRef.current.play()
  }, [enabled])

  const playReveal = useCallback(() => {
    if (!enabled || !revealRef.current) return
    revealRef.current.play()
  }, [enabled])

  return { playBgm, stopBgm, playShuffle, playCardFlip, playReveal }
}
