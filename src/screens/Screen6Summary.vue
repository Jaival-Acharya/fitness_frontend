<template>
  <div class="page-wrapper">
    <label class="label">STEP 6 OF 6</label>
    <h1 class="heading-display">Your fitness profile</h1>
    <p class="body-secondary">Here's your complete summary and personalized plan.</p>

    <!-- BMI Gauge -->
    <div class="card">
      <BMIGauge :bmi="userStore.bmi || 22" />
    </div>

    <!-- Stats Grid (2x2) -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Weight</div>
        <div class="stat-value">{{ userStore.weight }}<span class="unit">kg</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Height</div>
        <div class="stat-value">{{ userStore.height }}<span class="unit">cm</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Age</div>
        <div class="stat-value">{{ userStore.age }}<span class="unit">y</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Goal</div>
        <div class="stat-value">{{ getSummaryLabel(userStore.fitnessGoal) }}</div>
      </div>
    </div>

    <!-- Daily Calorie Card -->
    <div class="card calorie-card">
      <div class="calorie-label">Daily Calorie Target</div>
      <div class="calorie-value">{{ calorieTarget }} <span class="calorie-unit">kcal</span></div>
      <div class="calorie-subtitle">Based on your profile and fitness goal</div>
    </div>

    <!-- Details Card -->
    <div class="card details-card">
      <div class="detail-row">
        <span class="detail-label">Gender</span>
        <span class="detail-value">{{ userStore.gender }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Activity</span>
        <span class="detail-value">{{ getActivityLabel(userStore.activityLevel) }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Diet</span>
        <span class="detail-value">{{ getDietLabel(userStore.dietType) }}</span>
      </div>
      <div v-if="userStore.restrictions" class="detail-row">
        <span class="detail-label">Restrictions</span>
        <span class="detail-value">{{ userStore.restrictions }}</span>
      </div>
    </div>

    <!-- Start Over Button -->
    <button class="btn-primary start-over" @click="startOver">Start Over</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import BMIGauge from '../components/BMIGauge.vue'

const router = useRouter()
const userStore = useUserStore()

const calorieTarget = computed(() => {
  const { weight, height, age, gender, activityLevel, fitnessGoal } = userStore

  if (!weight || !height || !age) return '—'

  // BMR calculation
  let bmr
  const genderFactor = gender === 'Male' ? 5 : -161
  bmr = 10 * weight + 6.25 * height - 5 * age + genderFactor

  // Activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
  }

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2)

  // Goal adjustment
  let calTarget
  if (fitnessGoal === 'lose') {
    calTarget = Math.round(tdee - 500)
  } else if (fitnessGoal === 'build') {
    calTarget = Math.round(tdee + 300)
  } else {
    calTarget = Math.round(tdee)
  }

  return calTarget
})

function getSummaryLabel(goal) {
  const labels = {
    lose: 'Lose Weight',
    maintain: 'Maintain',
    build: 'Build Muscle',
  }
  return labels[goal] || goal
}

function getActivityLabel(activity) {
  const labels = {
    sedentary: 'Sedentary',
    light: 'Light',
    moderate: 'Moderate',
    very_active: 'Very Active',
  }
  return labels[activity] || activity
}

function getDietLabel(diet) {
  const labels = {
    veg: 'Vegetarian',
    egg: 'Eggetarian',
    nonveg: 'Non-Vegetarian',
  }
  return labels[diet] || diet
}

function startOver() {
  userStore.reset()
  router.push('/')
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
  margin-bottom: 24px;
}

.card {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #f9faf9;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #ef4444;
}

.unit {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 3px;
}

.calorie-card {
  background: linear-gradient(135deg, #fef2f2 0%, #fef5f5 100%);
  border: 1px solid #fca5a5;
  text-align: center;
  padding: 24px;
}

.calorie-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.calorie-value {
  font-size: 32px;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 8px;
}

.calorie-unit {
  font-size: 14px;
  margin-left: 6px;
}

.calorie-subtitle {
  font-size: 12px;
  color: #9ca3af;
}

.details-card {
  background: #ffffff;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
}

.start-over {
  width: 100%;
  height: 34px;
  padding: 0 16px;
  background: #ef4444;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
}

.start-over:hover {
  background: #dc2626;
  transform: translateY(-1px);
}
</style>

