<template>
  <div class="summary-wrapper">
    <div class="summary-container">
      <h1 class="title">Your Health Summary</h1>
      
      <!-- User Profile Section -->
      <div v-if="userStore.weight" class="section">
        <h2 class="section-title">📊 Your Profile</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Weight</span>
            <span class="value">{{ userStore.weight }} kg</span>
          </div>
          <div class="info-item">
            <span class="label">Height</span>
            <span class="value">{{ userStore.height }} cm</span>
          </div>
          <div class="info-item">
            <span class="label">Age</span>
            <span class="value">{{ userStore.age }} years</span>
          </div>
          <div class="info-item">
            <span class="label">BMI</span>
            <span class="value">{{ userStore.bmi.toFixed(1) }}</span>
          </div>
        </div>
      </div>

      <!-- Fitness Goal Section -->
      <div v-if="userStore.fitnessGoal" class="section">
        <h2 class="section-title">🎯 Fitness Goal</h2>
        <div class="goal-card">
          <p class="goal-text">{{ capitalizeGoal(userStore.fitnessGoal) }} Weight</p>
          <p v-if="userStore.targetWeight" class="target-text">
            Target: {{ userStore.targetWeight }} kg
            <span v-if="userStore.weight" class="delta">
              ({{ Math.abs(userStore.targetWeight - userStore.weight).toFixed(1) }} kg to go)
            </span>
          </p>
        </div>
      </div>

      <!-- Diet Type Section -->
      <div v-if="userStore.dietType" class="section">
        <h2 class="section-title">🥗 Diet Type</h2>
        <div class="diet-badge">
          {{ capitalizeDiet(userStore.dietType) }}
        </div>
      </div>

      <!-- Daily Nutrition Targets -->
      <div v-if="userStore.dailyTargets" class="section">
        <h2 class="section-title">📈 Daily Nutrition Targets</h2>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <span class="nutrition-label">Calories</span>
            <span class="nutrition-value">{{ userStore.dailyTargets.calories }}</span>
            <span class="nutrition-unit">kcal</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">Protein</span>
            <span class="nutrition-value">{{ userStore.dailyTargets.protein.toFixed(1) }}</span>
            <span class="nutrition-unit">g</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">Carbs</span>
            <span class="nutrition-value">{{ userStore.dailyTargets.carbs.toFixed(1) }}</span>
            <span class="nutrition-unit">g</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">Fat</span>
            <span class="nutrition-value">{{ userStore.dailyTargets.fat.toFixed(1) }}</span>
            <span class="nutrition-unit">g</span>
          </div>
        </div>
      </div>

      <!-- Current Meal Plan -->
      <div v-if="userStore.mealPlan && userStore.mealPlan.breakfastDish" class="section">
        <h2 class="section-title">🍽️ Your Meal Plan</h2>
        <div class="meals-summary">
          <div v-if="userStore.mealPlan.breakfastDish" class="meal-item">
            <span class="emoji">🌅</span>
            <span class="meal-name">Breakfast:</span>
            <span class="dish-name">{{ userStore.mealPlan.breakfastDish.name }}</span>
            <span class="meal-cal">{{ userStore.mealPlan.breakfastDish.calories }} cal</span>
          </div>
          <div v-if="userStore.mealPlan.lunchDish" class="meal-item">
            <span class="emoji">🍽️</span>
            <span class="meal-name">Lunch:</span>
            <span class="dish-name">{{ userStore.mealPlan.lunchDish.name }}</span>
            <span class="meal-cal">{{ userStore.mealPlan.lunchDish.calories }} cal</span>
          </div>
          <div v-if="userStore.mealPlan.dinnerDish" class="meal-item">
            <span class="emoji">🌙</span>
            <span class="meal-name">Dinner:</span>
            <span class="dish-name">{{ userStore.mealPlan.dinnerDish.name }}</span>
            <span class="meal-cal">{{ userStore.mealPlan.dinnerDish.calories }} cal</span>
          </div>
        </div>
        <div class="meal-totals">
          <span>Total Calories: {{ userStore.mealPlan.totalCalories }} kcal</span>
          <span>Protein: {{ userStore.mealPlan.totalProtein.toFixed(1) }}g</span>
          <span>Carbs: {{ userStore.mealPlan.totalCarbs.toFixed(1) }}g</span>
          <span>Fat: {{ userStore.mealPlan.totalFat.toFixed(1) }}g</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="button-group">
        <button class="btn btn-secondary" @click="goBack">← Back</button>
        <button class="btn btn-primary" @click="startOver">Start New Plan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

function capitalizeGoal(goal) {
  const goals = {
    'lose': 'Lose',
    'maintain': 'Maintain',
    'build': 'Build'
  }
  return goals[goal] || goal
}

function capitalizeDiet(diet) {
  const diets = {
    'veg': 'Vegetarian',
    'egg': 'Egg-based',
    'nonveg': 'Non-Vegetarian'
  }
  return diets[diet] || diet
}

function goBack() {
  router.back()
}

function startOver() {
  userStore.reset()
  router.push('/')
}
</script>

<style scoped>
.summary-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}

.label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.goal-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
}

.goal-text {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.target-text {
  font-size: 0.95rem;
  opacity: 0.9;
}

.delta {
  display: block;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.diet-badge {
  display: inline-block;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1rem;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.nutrition-item {
  background: #f5f5f5;
  padding: 1.2rem;
  border-radius: 10px;
  text-align: center;
}

.nutrition-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.nutrition-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
}

.nutrition-unit {
  display: block;
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.3rem;
}

.meals-summary {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.meal-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.meal-item:last-child {
  border-bottom: none;
}

.emoji {
  font-size: 1.2rem;
}

.meal-name {
  font-weight: 600;
  min-width: 70px;
  color: #333;
}

.dish-name {
  flex: 1;
  color: #667eea;
  font-weight: 500;
}

.meal-cal {
  color: #999;
  font-size: 0.9rem;
}

.meal-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  background: #e8eaf6;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
}

.meal-totals span {
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #667eea;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
