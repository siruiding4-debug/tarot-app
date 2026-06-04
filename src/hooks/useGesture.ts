import { useEffect, useRef, useState, useCallback } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import type { GestureResult, HandLandmark } from '@/types'
import { detectGesture, resetGestureState } from '@/utils/gestureDetector'

/** MediaPipe 是否已初始化 */
let handLandmarker: HandLandmarker | null = null
let isInitializing = false

/**
 * 初始化 MediaPipe HandLandmarker（全局单例）
 */
async function initHandLandmarker(): Promise<HandLandmarker> {
  if (handLandmarker) return handLandmarker
  if (isInitializing) {
    // 等待其他调用完成初始化
    await new Promise((r) => setTimeout(r, 100))
    return initHandLandmarker()
  }

  isInitializing = true
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
  )
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
    },
    runningMode: 'VIDEO',
    numHands: 1,
  })
  isInitializing = false
  return handLandmarker
}

interface UseGestureOptions {
  /** 是否激活手势检测 */
  enabled: boolean
  /** 视频元素 */
  videoRef: React.RefObject<HTMLVideoElement | null>
  /** 渲染画布尺寸 */
  canvasWidth?: number
  canvasHeight?: number
}

/**
 * 手势识别 Hook
 * 从摄像头视频流中实时检测手势
 */
export function useGesture({
  enabled,
  videoRef,
  canvasWidth = 640,
  canvasHeight = 480,
}: UseGestureOptions) {
  const [gesture, setGesture] = useState<GestureResult>({
    type: 'none',
    confidence: 0,
    landmarks: null,
  })
  const [isModelReady, setIsModelReady] = useState(false)
  const animationFrameRef = useRef<number>(0)
  const lastDetectionTime = useRef<number>(0)
  const DETECTION_INTERVAL = 50 // 每 50ms 检测一次

  // 初始化模型
  useEffect(() => {
    initHandLandmarker()
      .then(() => setIsModelReady(true))
      .catch((err) => console.error('MediaPipe 初始化失败:', err))
  }, [])

  // 检测循环
  const detect = useCallback(() => {
    if (!enabled || !handLandmarker || !videoRef.current) {
      animationFrameRef.current = requestAnimationFrame(detect)
      return
    }

    const now = Date.now()
    if (now - lastDetectionTime.current < DETECTION_INTERVAL) {
      animationFrameRef.current = requestAnimationFrame(detect)
      return
    }
    lastDetectionTime.current = now

    const video = videoRef.current
    if (video.readyState >= 2) {
      const result = handLandmarker.detectForVideo(video, performance.now())
      let landmarks: HandLandmark[] | null = null

      if (result.landmarks && result.landmarks.length > 0) {
        landmarks = result.landmarks[0] as HandLandmark[]
      }

      const gestureResult = detectGesture(landmarks, canvasWidth, canvasHeight)
      setGesture(gestureResult)
    }

    animationFrameRef.current = requestAnimationFrame(detect)
  }, [enabled, videoRef, canvasWidth, canvasHeight])

  // 启动/停止检测循环
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(detect)
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [detect])

  // 重置手势状态
  const resetGesture = useCallback(() => {
    resetGestureState()
    setGesture({ type: 'none', confidence: 0, landmarks: null })
  }, [])

  return { gesture, isModelReady, resetGesture }
}
