<template>
  <div class="page-wrapper">
    <label class="label">GETTING STARTED</label>
    <h1 class="heading-display">Start with your body measurements</h1>
    <p class="body-secondary">We'll use these to calculate your personalized nutrition plan.</p>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Measurement Card -->
    <div class="card">
      <div class="form-grid">
        <!-- Height -->
        <div>
          <label class="field-label">Height</label>
          <input
            v-model.number="height"
            type="range"
            min="100"
            max="220"
            step="0.1"
            class="slider"
          />
          <div class="range-display">{{ height.toFixed(0) }} cm</div>
        </div>

        <!-- Weight -->
        <div>
          <label class="field-label">Weight</label>
          <input
            v-model.number="weight"
            type="range"
            min="30"
            max="200"
            step="0.1"
            class="slider"
          />
          <div class="range-display">{{ weight.toFixed(1) }} kg</div>
        </div>
      </div>
    </div>

    <!-- BMI Display Card -->
    <div class="card">
      <BMIGauge :bmi="calculatedBmi" />
    </div>

    <!-- Button -->
    <button 
      class="btn-primary" 
      @click="handleContinue"
      :disabled="loading"
    >
      {{ loading ? 'Calculating...' : 'Continue →' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { calculateBMI } from '../api'
import BMIGauge from '../components/BMIGauge.vue'

const router = useRouter()
const userStore = useUserStore()

const weight = ref(70)
const height = ref(175)
const loading = ref(false)
const error = ref('')

const calculatedBmi = computed(() => {
  if (weight.value <= 0 || height.value <= 0) return 0
  return weight.value / ((height.value / 100) ** 2)
})

async function handleContinue() {
  if (weight.value <= 0 || height.value <= 0) {
    error.value = 'Please enter valid weight and height'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await calculateBMI(weight.value, height.value)
    const { sessionId, bmi, category } = response.data

    userStore.setBMI({
      sessionId,
      bmi,
      category,
      weight: weight.value,
      height: height.value,
    })

    await router.push('/details')
  } catch (err) {
    error.value = 'Failed to calculate BMI. Please try again.'
    console.error('BMI Calculation Error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 12px;
}

.heading-display {
  font-family: var(--font-family);
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
  margin-bottom: 12px;
}

.body-secondary {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.5;
}

.card {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #d1d5db;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  margin-bottom: 8px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  background: #dc2626;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.15);
  background: #dc2626;
}

.range-display {
  font-size: 13px;
  font-weight: 600;
  color: #ef4444;
}

.btn-primary {
  width: 100%;
  padding: 0 16px;
  height: 34px;
  background: #ef4444;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  color: #ef4444;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 13px;
}
</style>

