<template>
  <div class="page-wrapper">
    <label class="label">STEP 3 OF 6</label>
    <h1 class="heading-display">What's your diet preference?</h1>
    <p class="body-secondary">This selection affects which dishes are shown in your meal plan.</p>

    <!-- Diet Selection Cards -->
    <div class="diet-cards-stack">
      <button
        v-for="diet in diets"
        :key="diet.value"
        :class="['select-card-horizontal', selectedDiet === diet.value ? 'selected' : '']"
        @click="selectedDiet = diet.value"
      >
        <div class="diet-content">
          <div class="diet-emoji">{{ diet.emoji }}</div>
          <div class="diet-info">
            <div class="diet-title">{{ diet.title }}</div>
            <div class="diet-description">{{ diet.description }}</div>
          </div>
        </div>
        <span class="radio-dot" :class="{ active: selectedDiet === diet.value }" />
      </button>
    </div>

    <!-- Buttons -->
    <div class="button-row">
      <button class="btn-secondary" @click="goBack">← Back</button>
      <button class="btn-primary" @click="handleContinue" :disabled="loading">{{ loading ? 'Saving...' : 'Continue →' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { updateSession } from '../api'

const router = useRouter()
const userStore = useUserStore()

const selectedDiet = ref('veg')
const loading = ref(false)

const diets = [
  {
    value: 'veg',
    title: 'Vegetarian',
    emoji: '🥦',
    description: 'Plant-based foods only, no meat or eggs',
  },
  {
    value: 'egg',
    title: 'Eggetarian',
    emoji: '🍳',
    description: 'Vegetarian plus eggs — no meat or fish',
  },
  {
    value: 'nonveg',
    title: 'Non-Vegetarian',
    emoji: '🍗',
    description: 'All food groups including meat and fish',
  },
]

async function handleContinue() {
  loading.value = true

  try {
    await updateSession(userStore.sessionId, {
      diet_type: selectedDiet.value,
    })

    userStore.setDiet(selectedDiet.value)
    await router.push('/meals')
  } catch (err) {
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
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
  font-size: clamp(2rem, 1.65rem + 0.9vw, 2.5rem);
  font-weight: 600;
  color: #111110;
  line-height: 1.3;
  margin-bottom: 12px;
}

.body-secondary {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 36px;
}

.diet-cards-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 36px;
}

.select-card-horizontal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.select-card-horizontal:hover {
  border-color: #ef4444;
  background: #fef2f2;
}

.select-card-horizontal.selected {
  border-color: #ef4444;
  background: #fef2f2;
}

.diet-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.diet-emoji {
  font-size: 28px;
  min-width: 40px;
  text-align: center;
}

.diet-info {
  text-align: left;
}

.diet-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.diet-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.radio-dot {
  width: 12px;
  height: 12px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.radio-dot.active {
  border-color: #ef4444;
  background: #ef4444;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 32px;
}

.btn-primary,
.btn-secondary {
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #1a6b4a;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #0f4d35;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f2f2f0;
  color: #111110;
}

.btn-secondary:hover {
  background: #e3e3df;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .body-secondary {
    font-size: 13px;
    margin-bottom: 28px;
  }

  .diet-cards-stack {
    gap: 10px;
    margin-bottom: 28px;
  }

  .select-card-horizontal {
    padding: 14px;
    border-radius: 10px;
  }

  .diet-title {
    font-size: 13px;
  }

  .diet-description {
    font-size: 12px;
  }

  .button-row {
    gap: 10px;
    margin-top: 24px;
  }

  .btn-primary,
  .btn-secondary {
    height: 36px;
    font-size: 13px;
  }
}
</style>

