<template>
  <div class="meal-plan-wrapper">
    <div class="meal-plan-container">
      <!-- Header -->
      <div class="header">
        <h1 class="title">🍽️ Your Meal Plan</h1>
        <p class="subtitle">Select how many days you want to plan for</p>
      </div>

      <!-- Days Selection -->
      <div class="days-selector">
        <label class="selector-label">Select Days:</label>
        <div class="days-buttons">
          <button 
            v-for="day in 7" 
            :key="day"
            class="day-btn"
            :class="{ active: selectedDays === day }"
            @click="selectedDays = day"
          >
            {{ day }}
          </button>
        </div>
      </div>

      <!-- Generate Plan Button -->
      <button 
        class="btn btn-generate"
        @click="generateWeekMealPlan"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">✨ Generate Meal Plan</span>
        <span v-else>Loading...</span>
      </button>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading">
        <p>Generating your personalized meal plan...</p>
      </div>

      <!-- Meal Plans Display -->
      <div v-if="userStore.weekMealPlan.mealPlans.length > 0" class="meal-plans-section">
        <!-- Week Summary -->
        <div class="week-summary">
          <h2 class="section-title">📊 Week Summary</h2>
          <div class="macro-cards">
            <div class="macro-card">
              <span class="macro-label">Total Calories</span>
              <span class="macro-value">{{ userStore.weekMealPlan.weekCalories }}</span>
              <span class="macro-unit">kcal / {{ userStore.weekMealPlan.targetCalories }}</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill calories"
                  :style="{ width: getProgressPercent(userStore.weekMealPlan.weekCalories, userStore.weekMealPlan.targetCalories) + '%' }"
                ></div>
              </div>
            </div>

            <div class="macro-card">
              <span class="macro-label">Protein</span>
              <span class="macro-value">{{ userStore.weekMealPlan.weekProtein.toFixed(0) }}</span>
              <span class="macro-unit">g</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill protein"
                  :style="{ width: getProgressPercent(userStore.weekMealPlan.weekProtein, userStore.dailyTargets.protein * userStore.weekMealPlan.days) + '%' }"
                ></div>
              </div>
            </div>

            <div class="macro-card">
              <span class="macro-label">Carbs</span>
              <span class="macro-value">{{ userStore.weekMealPlan.weekCarbs.toFixed(0) }}</span>
              <span class="macro-unit">g</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill carbs"
                  :style="{ width: getProgressPercent(userStore.weekMealPlan.weekCarbs, userStore.dailyTargets.carbs * userStore.weekMealPlan.days) + '%' }"
                ></div>
              </div>
            </div>

            <div class="macro-card">
              <span class="macro-label">Fat</span>
              <span class="macro-value">{{ userStore.weekMealPlan.weekFat.toFixed(0) }}</span>
              <span class="macro-unit">g</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill fat"
                  :style="{ width: getProgressPercent(userStore.weekMealPlan.weekFat, userStore.dailyTargets.fat * userStore.weekMealPlan.days) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Meal Plans -->
        <div class="daily-plans">
          <h2 class="section-title">📅 Daily Plans</h2>
          <div class="days-grid">
            <div 
              v-for="dayPlan in userStore.weekMealPlan.mealPlans"
              :key="dayPlan.day"
              class="day-card"
            >
              <h3 class="day-title">Day {{ dayPlan.day }}</h3>
              
              <div class="meals">
                <div v-if="dayPlan.breakfast_dish" class="meal-item">
                  <span class="meal-emoji">🌅</span>
                  <div class="meal-details">
                    <p class="meal-type">Breakfast</p>
                    <p class="meal-name">{{ dayPlan.breakfast_dish.name }}</p>
                    <p class="meal-nutrition">{{ dayPlan.breakfast_dish.calories }} cal | P: {{ dayPlan.breakfast_dish.protein }}g</p>
                  </div>
                  <button class="meal-swap-btn" @click="openSwapModal('breakfast', dayPlan.day - 1)">Swap</button>
                </div>

                <div v-if="dayPlan.lunch_dish" class="meal-item">
                  <span class="meal-emoji">🍽️</span>
                  <div class="meal-details">
                    <p class="meal-type">Lunch</p>
                    <p class="meal-name">{{ dayPlan.lunch_dish.name }}</p>
                    <p class="meal-nutrition">{{ dayPlan.lunch_dish.calories }} cal | P: {{ dayPlan.lunch_dish.protein }}g</p>
                  </div>
                  <button class="meal-swap-btn" @click="openSwapModal('lunch', dayPlan.day - 1)">Swap</button>
                </div>

                <div v-if="dayPlan.dinner_dish" class="meal-item">
                  <span class="meal-emoji">🌙</span>
                  <div class="meal-details">
                    <p class="meal-type">Dinner</p>
                    <p class="meal-name">{{ dayPlan.dinner_dish.name }}</p>
                    <p class="meal-nutrition">{{ dayPlan.dinner_dish.calories }} cal | P: {{ dayPlan.dinner_dish.protein }}g</p>
                  </div>
                  <button class="meal-swap-btn" @click="openSwapModal('dinner', dayPlan.day - 1)">Swap</button>
                </div>
              </div>

              <div class="day-totals">
                <span>{{ dayPlan.total_calories }} cal</span>
                <span>{{ dayPlan.total_protein.toFixed(0) }}g P</span>
                <span>{{ dayPlan.total_carbs.toFixed(0) }}g C</span>
                <span>{{ dayPlan.total_fat.toFixed(0) }}g F</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Action Buttons at Bottom -->
      <div class="bottom-action-buttons">
        <button class="btn btn-secondary" @click="goBack">← Back</button>
        <button class="btn btn-export" @click="exportPDF">📥 Export PDF</button>
        <button class="btn btn-primary" @click="goForward">Continue →</button>
      </div>

      <!-- Browse Dishes Section -->
      <div v-if="userStore.weekMealPlan.mealPlans.length > 0" class="browse-section">
        <h2 class="section-title">🔄 Swap Any Meal</h2>
        <p class="section-desc">Browse and select alternative meals below</p>

        <!-- Filter Chips -->
        <div class="filter-chips">
          <button
            v-for="meal in mealTypes"
            :key="meal"
            :class="['chip', selectedMeal === meal ? 'chip-active' : 'chip-default']"
            @click="selectedMeal = meal"
          >
            {{ meal }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card" />
        </div>

        <!-- Dishes Grid -->
        <div v-else-if="filteredDishes.length > 0" class="dishes-grid">
          <DishCard
            v-for="dish in filteredDishes"
            :key="dish.id"
            :dish="dish"
            :is-swappable="swapMode"
            @click="handleSwapSelection(dish)"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>No dishes found. Try a different filter.</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Meal Swap Modal -->
      <MealSwapModal
        :is-open="swapModalOpen"
        :meal-type="swapMealType"
        @close="closeSwapModal"
        @select="handleMealSwap"
      />

      <!-- Recipe Modal -->
      <RecipeModal
        :is-open="modalOpen"
        :recipe="selectedRecipe"
        @close="modalOpen = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getDishes, getDishById, suggestWeekMealPlan } from '@/api'
import DishCard from '@/components/DishCard.vue'
import RecipeModal from '@/components/RecipeModal.vue'
import MealSwapModal from '@/components/MealSwapModal.vue'

const router = useRouter()
const userStore = useUserStore()

const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack']
const selectedMeal = ref('All')
const dishes = ref([])
const loading = ref(true)
const isLoading = ref(false)
const selectedDays = ref(1)
const error = ref('')
const modalOpen = ref(false)
const selectedRecipe = ref({})
const swapModalOpen = ref(false)
const swapMode = ref(false)
const swapMealType = ref(null)
const swapDayIndex = ref(null)

const filteredDishes = computed(() => {
  if (selectedMeal.value === 'All') {
    return dishes.value
  }
  return dishes.value.filter((dish) => dish.meal_type === selectedMeal.value)
})

onMounted(async () => {
  await fetchDishes()
})

watch(selectedMeal, async () => {
  await fetchDishes()
})

async function fetchDishes() {
  loading.value = true
  error.value = ''

  try {
    const response = await getDishes(userStore.dietType, {
      meal: selectedMeal.value === 'All' ? null : selectedMeal.value,
      excludeAllergens: userStore.getAllergiesList(),
      sessionId: userStore.sessionId,
    })
    dishes.value = response.data || []
  } catch (err) {
    error.value = 'Failed to load dishes. Please try again.'
    console.error('Error fetching dishes:', err)
  } finally {
    loading.value = false
  }
}

function getProgressPercent(current, target) {
  if (target <= 0) return 0
  const percent = (current / target) * 100
  return Math.min(percent, 100)
}

async function generateWeekMealPlan() {
  isLoading.value = true
  error.value = ''

  try {
    const response = await suggestWeekMealPlan(
      userStore.sessionId,
      userStore.fitnessGoal,
      userStore.dietType,
      selectedDays.value
    )
    
    userStore.setWeekMealPlan(response.data)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to generate meal plan'
    console.error('Error generating meal plan:', err)
  } finally {
    isLoading.value = false
  }
}

function openSwapModal(mealType, dayIndex) {
  swapMealType.value = mealType
  swapDayIndex.value = dayIndex
  swapMode.value = true
  swapModalOpen.value = true
  selectedMeal.value = mealType.charAt(0).toUpperCase() + mealType.slice(1)
}

function closeSwapModal() {
  swapModalOpen.value = false
  swapMode.value = false
  swapMealType.value = null
  swapDayIndex.value = null
  selectedMeal.value = 'All'
}

function handleMealSwap(dish) {
  userStore.swapMealInWeekPlan(swapDayIndex.value, swapMealType.value, dish)
  closeSwapModal()
}

function handleSwapSelection(dish) {
  if (swapMode.value) {
    userStore.swapMealInWeekPlan(swapDayIndex.value, swapMealType.value, dish)
    closeSwapModal()
  } else {
    openRecipe(dish)
  }
}

async function openRecipe(dish) {
  try {
    const response = await getDishById(dish.id)
    selectedRecipe.value = response.data
    modalOpen.value = true
  } catch (err) {
    error.value = 'Failed to load recipe. Please try again.'
    console.error('Error fetching dish:', err)
  }
}

function goBack() {
  router.back()
}

async function exportPDF() {
  try {
    // Prepare meal data for each day in the week plan
    const weekData = userStore.weekMealPlan.mealPlans.map(day => ({
      day: day.day,
      breakfast_dish_id: day.breakfast_dish?.id,
      lunch_dish_id: day.lunch_dish?.id,
      dinner_dish_id: day.dinner_dish?.id,
    }))

    // Call backend to generate PDF with full recipe data
    const response = await fetch('http://localhost:8080/api/meal-plans/export-week-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: userStore.sessionId,
        week_meals: weekData,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate PDF')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `meal-plan-${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  } catch (err) {
    console.error('Failed to export PDF:', err)
    alert('Failed to generate PDF. Please try again.')
  }
}

function goForward() {
  router.push('/summary')
}
</script>

<style scoped>
.meal-plan-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 1rem;
}

.meal-plan-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 1000px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #666;
}

/* Days Selection */
.days-selector {
  margin-bottom: 2rem;
}

.selector-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.days-buttons {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.8rem;
}

.day-btn {
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.day-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.day-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Generate Button */
.btn-generate {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
  color: #667eea;
  font-weight: 600;
}

/* Week Summary */
.meal-plans-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.week-summary {
  margin-bottom: 3rem;
}

.macro-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.macro-card {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 15px;
  border: 2px solid #e8eaf6;
  transition: all 0.3s ease;
}

.macro-card:hover {
  border-color: #667eea;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.macro-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.macro-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.2rem;
}

.macro-unit {
  display: block;
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.calories {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.progress-fill.protein {
  background: linear-gradient(90deg, #ff6b6b 0%, #ff8e72 100%);
}

.progress-fill.carbs {
  background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%);
}

.progress-fill.fat {
  background: linear-gradient(90deg, #f7b731 0%, #f89b45 100%);
}

/* Daily Plans */
.daily-plans {
  margin-bottom: 2rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.day-card {
  background: #f9f9f9;
  border: 2px solid #e8eaf6;
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.day-card:hover {
  border-color: #667eea;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.day-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.meals {
  margin-bottom: 1rem;
}

.meal-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
}

.meal-emoji {
  font-size: 1.5rem;
  min-width: 40px;
}

.meal-details {
  flex: 1;
  min-width: 0;
}

.meal-type {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meal-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0.2rem 0;
}

.meal-nutrition {
  font-size: 0.8rem;
  color: #667eea;
  margin: 0;
  font-weight: 500;
}

.meal-swap-btn {
  width: 7rem;
  height: 3rem;
  padding: 0.4rem 0.8rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-left: auto;
  margin-top: 1rem;
}

.meal-swap-btn:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.day-totals {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  background: #e8eaf6;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #333;
  font-weight: 600;
  text-align: center;
}

/* Action Buttons */
.bottom-action-buttons {
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
  height: auto;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #667eea;
  font-weight: 600;
  height: auto;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-export {
  background: #4ecdc4;
  color: white;
  font-weight: 600;
}

.btn-export:hover {
  background: #45b8b0;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(78, 205, 196, 0.3);
}

/* Error Message */
.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  font-weight: 500;
}

/* Browse Section */
.browse-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.section-desc {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.filter-chips {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.chip {
  padding: 0.6rem 1.2rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #666;
}

.chip:hover {
  border-color: #667eea;
  color: #667eea;
}

.chip-active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chip-default {
  background: white;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  height: 200px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  font-weight: 500;
}

@media (max-width: 768px) {
  .days-buttons {
    grid-template-columns: repeat(4, 1fr);
  }

  .macro-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .days-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .dishes-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .filter-chips {
    gap: 0.5rem;
  }

  .chip {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}
</style>

