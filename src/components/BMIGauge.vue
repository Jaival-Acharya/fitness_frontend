<template>
  <div class="bmi-gauge-container">
    <canvas
      ref="canvas"
      width="280"
      height="148"
      class="bmi-canvas"
    />
    <div class="bmi-legend">
      <div class="legend-item">
        <span class="legend-dot underweight" />
        <span>Underweight</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot normal" />
        <span>Normal</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot overweight" />
        <span>Overweight</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot obese" />
        <span>Obese</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  bmi: {
    type: Number,
    default: 22,
  },
})

const canvas = ref(null)
let animationId = null

onMounted(() => {
  draw()
})

watch(
  () => props.bmi,
  () => {
    if (animationId) cancelAnimationFrame(animationId)
    draw()
  }
)

function getColorForBMI(bmi) {
  if (bmi < 18.5) return { color: '#3b82f6', label: 'Underweight' }
  if (bmi < 25) return { color: '#10b981', label: 'Normal weight' }
  if (bmi < 30) return { color: '#f59e0b', label: 'Overweight' }
  return { color: '#ef4444', label: 'Obese' }
}

function draw() {
  const ctx = canvas.value.getContext('2d')
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height - 20
  const radius = 75
  const lineWidth = 12

  // Clear canvas with light background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw arc segments
  const colors = [
    { color: '#3b7dd8', start: 10, end: 18.5 }, // underweight
    { color: '#1a6b4a', start: 18.5, end: 25 }, // normal
    { color: '#c47c1a', start: 25, end: 30 }, // overweight
    { color: '#c0392b', start: 30, end: 50 }, // obese
  ]

  colors.forEach((seg) => {
    const startAngle = Math.PI + ((seg.start / 50) * Math.PI)
    const endAngle = Math.PI + ((seg.end / 50) * Math.PI)

    ctx.strokeStyle = seg.color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.stroke()
  })

  // Draw needle
  const needleAngle = Math.PI + ((Math.min(Math.max(props.bmi, 10), 50) / 50) * Math.PI)
  const needleLength = radius - lineWidth / 2

  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(
    centerX + Math.cos(needleAngle) * needleLength,
    centerY + Math.sin(needleAngle) * needleLength
  )
  ctx.stroke()

  // Draw center circle
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
  ctx.fill()

  // Draw BMI value
  const { color, label } = getColorForBMI(props.bmi)
  ctx.fillStyle = '#1f2937'
  ctx.font = 'bold 22px Instrument Serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.bmi.toFixed(1), centerX, centerY - 42)

  // Draw label
  ctx.fillStyle = '#6b7280'
  ctx.font = '11px Geist'
  ctx.fillText(label, centerX, centerY - 20)
}
</script>

<style scoped>
.bmi-gauge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.bmi-canvas {
  max-width: 100%;
  height: auto;
  display: block;
}

.bmi-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  padding: 6px 12px;
  background: #f9faf9;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.legend-item:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.legend-dot.underweight {
  background: #3b7dd8;
}

.legend-dot.normal {
  background: #1a6b4a;
}

.legend-dot.overweight {
  background: #c47c1a;
}

.legend-dot.obese {
  background: #c0392b;
}
</style>

