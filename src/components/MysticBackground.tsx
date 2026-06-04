import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  fadeDir: number
  color: string
}

const COLORS = [
  'rgba(240, 208, 96, )', // 暖金
  'rgba(168, 85, 247, )', // 魔法紫
  'rgba(99, 102, 241, )', // 靛蓝
  'rgba(201, 168, 76, )', // 暗金
]

export default function MysticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 创建粒子
    function createParticles() {
      const count = Math.floor((canvas!.width * canvas!.height) / 8000)
      particles = Array.from({ length: count }, (): Particle => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        opacity: Math.random() * 0.6 + 0.1,
        fadeDir: Math.random() > 0.5 ? 1 : -1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }
    createParticles()

    function animate() {
      ctx!.fillStyle = '#0a0a0f'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      // 中心微光
      const cx = canvas!.width / 2
      const cy = canvas!.height / 2
      const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.min(cx, cy) * 0.8)
      gradient.addColorStop(0, 'rgba(30, 15, 50, 0.4)')
      gradient.addColorStop(0.5, 'rgba(10, 5, 20, 0.2)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx!.fillStyle = gradient
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      // 更新和绘制粒子
      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.fadeDir * 0.003

        if (p.opacity >= 0.7) p.fadeDir = -1
        if (p.opacity <= 0.05) p.fadeDir = 1

        // 循环边界
        if (p.x < 0) p.x = canvas!.width
        if (p.x > canvas!.width) p.x = 0
        if (p.y < 0) p.y = canvas!.height
        if (p.y > canvas!.height) p.y = 0

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color.replace(')', `${p.opacity})`)
        ctx!.fill()
      }

      // 绘制缓慢旋转的装饰环
      const time = Date.now() / 10000
      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.rotate(time)
      ctx!.strokeStyle = 'rgba(201, 168, 76, 0.06)'
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.arc(0, 0, Math.min(cx, cy) * 0.5, 0, Math.PI * 2)
      ctx!.stroke()

      // 六芒星
      drawHexagram(ctx!, 0, 0, Math.min(cx, cy) * 0.15, time)
      ctx!.restore()

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}

/** 绘制六芒星 */
function drawHexagram(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  rotation: number
) {
  ctx.save()
  ctx.rotate(rotation * 0.3)
  ctx.strokeStyle = 'rgba(240, 208, 96, 0.08)'
  ctx.lineWidth = 0.5

  // 正三角
  ctx.beginPath()
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()

  // 倒三角
  ctx.beginPath()
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 + Math.PI / 6 - Math.PI / 2
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()

  // 外环
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.05)'
  ctx.stroke()

  ctx.restore()
}
