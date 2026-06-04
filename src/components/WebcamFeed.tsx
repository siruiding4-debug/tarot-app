import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { HandLandmark } from '@/types'

interface WebcamFeedProps {
  /** 是否显示摄像头画面 */
  visible: boolean
  /** 摄像头画面尺寸 */
  size?: 'sm' | 'lg'
  /** 手部关键点（用于绘制骨架线） */
  landmarks?: HandLandmark[] | null
  /** 镜像翻转 */
  mirrored?: boolean
}

export interface WebcamFeedHandle {
  getVideoElement: () => HTMLVideoElement | null
}

/**
 * 摄像头画面组件
 * 支持手部骨架线叠加绘制
 */
const WebcamFeed = forwardRef<WebcamFeedHandle, WebcamFeedProps>(
  ({ visible, size = 'sm', landmarks, mirrored = true }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    useImperativeHandle(ref, () => ({
      getVideoElement: () => videoRef.current,
    }))

    // 启动摄像头
    useEffect(() => {
      if (!visible) return

      async function startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' },
          })
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.warn('摄像头访问失败:', err)
        }
      }
      startCamera()

      return () => {
        streamRef.current?.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }, [visible])

    // 绘制手部骨架线
    useEffect(() => {
      const canvas = canvasRef.current
      const video = videoRef.current
      if (!canvas || !video) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      function drawSkeleton() {
        canvas!.width = video!.videoWidth || 640
        canvas!.height = video!.videoHeight || 480
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

        if (!landmarks) return

        const w = canvas!.width
        const h = canvas!.height

        // 绘制关键点
        for (const lm of landmarks) {
          ctx!.beginPath()
          ctx!.arc(lm.x * w, lm.y * h, 3, 0, Math.PI * 2)
          ctx!.fillStyle = '#f0d060'
          ctx!.fill()
          ctx!.strokeStyle = 'rgba(240, 208, 96, 0.5)'
          ctx!.lineWidth = 1
          ctx!.stroke()
        }

        // 手指连线
        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4],     // 拇指
          [0, 5], [5, 6], [6, 7], [7, 8],     // 食指
          [0, 9], [9, 10], [10, 11], [11, 12], // 中指
          [0, 13], [13, 14], [14, 15], [15, 16], // 无名指
          [0, 17], [17, 18], [18, 19], [19, 20], // 小指
          [5, 9], [9, 13], [13, 17],             // 手指根部横向
        ]

        ctx!.strokeStyle = 'rgba(240, 208, 96, 0.4)'
        ctx!.lineWidth = 1.5
        for (const [i, j] of connections) {
          const a = landmarks[i]
          const b = landmarks[j]
          ctx!.beginPath()
          ctx!.moveTo(a.x * w, a.y * h)
          ctx!.lineTo(b.x * w, b.y * h)
          ctx!.stroke()
        }
      }

      const interval = setInterval(drawSkeleton, 30)
      return () => clearInterval(interval)
    }, [landmarks])

    const sizeClasses = {
      sm: 'w-48 h-36',
      lg: 'w-80 h-60',
    }

    return (
      <div
        className={`relative rounded-xl overflow-hidden border border-gold-dark/30
                    shadow-[0_0_15px_rgba(201,168,76,0.15)] transition-all duration-500
                    ${sizeClasses[size]} ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* 视频 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${mirrored ? '-scale-x-100' : ''}`}
        />

        {/* 骨架线画布 */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${mirrored ? '-scale-x-100' : ''}`}
        />

        {/* 顶部指示条 */}
        <div className="absolute top-2 left-2 right-2 flex items-center gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-text-dim">手势识别</span>
        </div>
      </div>
    )
  }
)

WebcamFeed.displayName = 'WebcamFeed'
export default WebcamFeed
