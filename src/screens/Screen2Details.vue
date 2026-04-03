<template>
  <div class="page-wrapper">
    <h1 class="heading-display">Tell us a little more about you</h1>
    <p class="body-secondary">Your preferences help us customize your plan.</p>

    <button class="btn-secondary back-top" @click="goBack">← Back</button>
    
    <!-- Age Slider Card -->
    <div class="card">
      <label class="field-label">Age</label>
      <input
      v-model.number="age"
      type="range"
      min="15"
      max="80"
      class="slider"
      />
      <div class="slider-display">{{ age }} years</div>
    </div>

    <!-- Heart Rate Card -->
    <div class="card">
      <label class="field-label">Resting Heart Rate (bpm)</label>
      <input
        v-model.number="heartRate"
        type="number"
        min="40"
        max="220"
        class="input-field"
      />
    </div>

    <!-- Gender Selector -->
    <div class="card">
      <label class="field-label">Gender</label>
      <div class="segmented-btn">
        <button
          v-for="option in genders"
          :key="option"
          :class="['seg-btn', gender === option ? 'active' : '']"
          @click="gender = option"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <!-- Activity Level -->
    <div class="card">
      <label class="field-label">Activity Level</label>
      <div class="select-cards">
        <button
          v-for="level in activityLevels"
          :key="level.value"
          :class="['select-card', activity === level.value ? 'selected' : '']"
          @click="activity = level.value"
        >
          <span class="icon">{{ level.icon }}</span>
          <span class="text">{{ level.label }}</span>
          <span class="radio-dot" :class="{ active: activity === level.value }" />
        </button>
      </div>
    </div>

    <!-- Fitness Goal -->
    <div class="card">
      <label class="field-label">Fitness Goal</label>
      <div class="select-cards-3col">
        <button
          v-for="goal in goals"
          :key="goal.value"
          :class="['select-card', fitnessGoal === goal.value ? 'selected' : '']"
          @click="fitnessGoal = goal.value"
        >
          <span class="icon">{{ goal.icon }}</span>
          <span class="text">{{ goal.title }}</span>
          <span class="radio-dot" :class="{ active: fitnessGoal === goal.value }" />
        </button>
      </div>
    </div>

    <!-- Target Weight (Conditional) -->
    <div v-if="fitnessGoal === 'lose' || fitnessGoal === 'build'" class="card target-weight-card">
      <label class="field-label">
        {{ fitnessGoal === 'lose' ? '🎯 Target Weight to Lose' : '🎯 Target Weight to Gain' }}
      </label>
      <div class="weight-input-group">
        <div class="weight-input">
          <label class="small-label">From (Current)</label>
          <input
            type="number"
            :value="userStore.weight"
            disabled
            class="input-field disabled"
          />
          <span class="unit">kg</span>
        </div>
        <div class="arrow">→</div>
        <div class="weight-input">
          <label class="small-label">To (Target)</label>
          <input
            v-model.number="targetWeight"
            type="number"
            step="0.1"
            :placeholder="`e.g., ${fitnessGoal === 'lose' ? userStore.weight - 10 : userStore.weight + 10}`"
            class="input-field"
          />
          <span class="unit">kg</span>
        </div>
      </div>
      <div v-if="targetWeight" class="weight-delta">
        <span v-if="fitnessGoal === 'lose'" class="delta-text">
          You plan to lose {{ (userStore.weight - targetWeight).toFixed(1) }} kg
        </span>
        <span v-else class="delta-text">
          You plan to gain {{ (targetWeight - userStore.weight).toFixed(1) }} kg
        </span>
      </div>
    </div>

    <!-- Current Weight Display (for Maintain) -->
    <div v-else-if="fitnessGoal === 'maintain'" class="card maintain-card">
      <label class="field-label">📊 Current Weight</label>
      <div class="current-weight-display">
        <div class="weight-value">{{ userStore.weight }}</div>
        <div class="weight-label">kg</div>
      </div>
      <div class="maintain-text">You'll maintain your current weight with proper nutrition and exercise.</div>
    </div>
    <div class="card">
      <label class="field-label">Select Allergies (Optional)</label>
      <div class="allergy-dropdown">
        <button
          type="button"
          class="dropdown-trigger"
          @click="allergyOpen = !allergyOpen"
        >
          <span>
            {{ selectedAllergies.length > 0
              ? `${selectedAllergies.length} selected`
              : 'Choose allergies to avoid' }}
          </span>
          <span class="dropdown-arrow">{{ allergyOpen ? '▲' : '▼' }}</span>
        </button>

        <div v-if="allergyOpen" class="dropdown-menu">
          <label
            v-for="item in allergyOptions"
            :key="item.value"
            class="dropdown-item"
          >
            <input
              v-model="selectedAllergies"
              type="checkbox"
              :value="item.value"
            />
            <span>{{ item.label }}</span>
          </label>
        </div>

        <div v-if="selectedAllergies.length > 0" class="selected-tags">
          <span
            v-for="tag in selectedAllergies"
            :key="tag"
            class="allergy-tag"
            >
            {{ allergyLabelMap[tag] || tag }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Buttons -->
    <div class="button-row">
      <div class="button-spacer" aria-hidden="true" />
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

const age = ref(30)
const heartRate = ref(userStore.heartRate || 72)
const gender = ref('Male')
const activity = ref('moderate')
const fitnessGoal = ref('maintain')
const targetWeight = ref(null)
const selectedAllergies = ref([
  ...(userStore.allergies || []),
])
const allergyOpen = ref(false)
const loading = ref(false)

const genders = ['Male', 'Female', 'Other']

const activityLevels = [
  { label: 'Sedentary', value: 'sedentary', icon: '🪑' },
  { label: 'Light', value: 'light', icon: '🚶' },
  { label: 'Moderate', value: 'moderate', icon: '🏃' },
  { label: 'Very Active', value: 'very_active', icon: '🏋️' },
]

const goals = [
  { title: 'Lose weight', value: 'lose', icon: '📉' },
  { title: 'Maintain', value: 'maintain', icon: '⚖️' },
  { title: 'Build muscle', value: 'build', icon: '💪' },
]

const allergyOptions = [
  { value: 'peanut', label: 'Peanut' },
  { value: 'tree_nut', label: 'Tree Nut' },
  { value: 'milk', label: 'Milk / Dairy' },
  { value: 'egg', label: 'Egg' },
  { value: 'soy', label: 'Soy' },
  { value: 'wheat', label: 'Wheat / Gluten' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
]

const allergyLabelMap = allergyOptions.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

async function handleContinue() {
  loading.value = true

  try {
    await updateSession(userStore.sessionId, {
      age: age.value,
      heart_rate: heartRate.value,
      gender: gender.value,
      activity_level: activity.value,
      fitness_goal: fitnessGoal.value,
      target_weight: targetWeight.value,
      allergies: selectedAllergies.value,
      restrictions_text: selectedAllergies.value.join(', '),
      restrictions: selectedAllergies.value.join(', '),
    })

    userStore.setDetails({
      age: age.value,
      heartRate: heartRate.value,
      gender: gender.value,
      activityLevel: activity.value,
      fitnessGoal: fitnessGoal.value,
      targetWeight: targetWeight.value,
      allergies: selectedAllergies.value,
      restrictions: selectedAllergies.value.join(', '),
    })

    await router.push('/diet')
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
  color: #6b6b66;
  margin-bottom: 16px;
}

.back-top {
  width: fit-content;
  padding: 0 12px;
  margin-bottom: 20px;
}

.card {
  background: #ffffff;
  border: 1px solid #e3e3df;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #111110;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e3e3df;
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

.slider-display {
  font-size: 13px;
  font-weight: 600;
  color: #ef4444;
}

.segmented-btn {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #f2f2f0;
  padding: 3px;
  border-radius: 6px;
}

.seg-btn {
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #6b6b66;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.seg-btn.active {
  background: #ffffff;
  color: #111110;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.select-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.select-cards-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.select-card {
  position: relative;
  padding: 16px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.select-card:hover {
  border-color: #ef4444;
  background: #fef2f2;
}

.select-card.selected {
  border-color: #ef4444;
  background: #fef2f2;
}

.icon {
  font-size: 24px;
}

.text {
  font-size: 12px;
  font-weight: 500;
  color: #111110;
  text-align: center;
}

.radio-dot {
  width: 12px;
  height: 12px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.radio-dot.active {
  border-color: #ef4444;
  background: #ef4444;
}

.input-field {
  width: 100%;
  padding: 0 12px;
  height: 34px;
  border: 1px solid #e3e3df;
  border-radius: 4px;
  font-size: 13px;
  color: #111110;
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: #1a6b4a;
  background: #f9faf9;
}

.input-field::placeholder {
  color: #a8a8a3;
}

.allergy-dropdown {
  position: relative;
}

.dropdown-trigger {
  width: 100%;
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0 12px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #1f2937;
  cursor: pointer;
}

.dropdown-menu {
  margin-top: 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #374151;
}

.selected-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.allergy-tag {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 32px;
}

.button-spacer {
  height: 34px;
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
  background: #ef4444;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #dc2626;
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

@media (min-width: 1025px) {
  .card {
    padding: 24px;
  }

  .select-cards {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .select-cards-3col {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .dropdown-menu {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .body-secondary {
    font-size: 13px;
  }

  .select-cards {
    grid-template-columns: 1fr 1fr;
  }

  .select-cards-3col {
    grid-template-columns: 1fr;
  }

  .dropdown-menu {
    grid-template-columns: 1fr;
  }

  .button-row {
    grid-template-columns: 1fr;
  }

  .button-spacer {
    display: none;
  }

  .btn-primary,
  .btn-secondary {
    height: 36px;
    font-size: 13px;
  }
}

/* Target Weight Styles */
.target-weight-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
  border: 1px solid #fcd34d;
}

.weight-input-group {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 12px;
}

.weight-input {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.small-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.weight-input .input-field {
  padding-right: 40px;
}

.weight-input .input-field.disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.unit {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  pointer-events: none;
}

.arrow {
  font-size: 20px;
  color: #999;
  margin-bottom: 8px;
}

.weight-delta {
  padding: 10px 12px;
  background: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22c55e;
  border-radius: 4px;
  margin-top: 8px;
}

.delta-text {
  font-size: 13px;
  font-weight: 600;
  color: #16a34a;
}

/* Maintain Card */
.maintain-card {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border: 1px solid #93c5fd;
}

.current-weight-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 16px 0;
}

.weight-value {
  font-size: 36px;
  font-weight: 700;
  color: #0369a1;
}

.weight-label {
  font-size: 18px;
  font-weight: 600;
  color: #0284c7;
}

.maintain-text {
  font-size: 13px;
  color: #0369a1;
  margin-top: 12px;
  padding: 10px;
  background: rgba(3, 105, 161, 0.05);
  border-radius: 6px;
}
</style>

