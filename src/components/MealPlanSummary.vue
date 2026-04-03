<template>
  <div class="meal-plan-summary bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 shadow-lg">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-900">Your Daily Meal Plan</h2>
      <button
        @click="$emit('generate')"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        🔄 Generate New Plan
      </button>
    </div>

    <!-- Daily Targets Summary -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg p-4">
        <div class="text-sm font-semibold text-slate-600">Calories</div>
        <div class="text-xl font-bold text-blue-600">{{ userStore.dailyTargets.calories }}</div>
        <div class="text-xs text-slate-500">target</div>
      </div>
      <div class="bg-white rounded-lg p-4">
        <div class="text-sm font-semibold text-slate-600">Protein</div>
        <div class="text-xl font-bold text-orange-600">{{ userStore.dailyTargets.protein }}g</div>
        <div class="text-xs text-slate-500">target</div>
      </div>
      <div class="bg-white rounded-lg p-4">
        <div class="text-sm font-semibold text-slate-600">Carbs</div>
        <div class="text-xl font-bold text-yellow-600">{{ userStore.dailyTargets.carbs }}g</div>
        <div class="text-xs text-slate-500">target</div>
      </div>
      <div class="bg-white rounded-lg p-4">
        <div class="text-sm font-semibold text-slate-600">Fat</div>
        <div class="text-xl font-bold text-red-600">{{ userStore.dailyTargets.fat }}g</div>
        <div class="text-xs text-slate-500">target</div>
      </div>
    </div>

    <!-- Meals Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MealCard
        meal-type="breakfast"
        emoji="🌅"
        title="Breakfast"
        :dish="userStore.mealPlan.breakfastDish"
        @swap="$emit('swap', 'breakfast')"
      />
      <MealCard
        meal-type="lunch"
        emoji="🍽️"
        title="Lunch"
        :dish="userStore.mealPlan.lunchDish"
        @swap="$emit('swap', 'lunch')"
      />
      <MealCard
        meal-type="dinner"
        emoji="🌙"
        title="Dinner"
        :dish="userStore.mealPlan.dinnerDish"
        @swap="$emit('swap', 'dinner')"
      />
    </div>

    <!-- Macro Progress Bars -->
    <div class="bg-white rounded-lg p-4 mb-6">
      <h3 class="font-bold text-slate-900 mb-4">Daily Progress</h3>
      
      <!-- Calories -->
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-semibold text-blue-700">Calories</span>
          <span class="text-sm font-bold text-blue-700">
            {{ Math.round(userStore.mealPlan.totalCalories) }} / {{ userStore.dailyTargets.calories }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all"
            :style="{ width: Math.min(macroBreakdown.calorieProgress, 100) + '%' }"
          />
        </div>
      </div>

      <!-- Protein -->
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-semibold text-orange-700">Protein</span>
          <span class="text-sm font-bold text-orange-700">
            {{ Math.round(userStore.mealPlan.totalProtein) }}g / {{ userStore.dailyTargets.protein }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-orange-600 h-2 rounded-full transition-all"
            :style="{ width: Math.min(macroBreakdown.proteinProgress, 100) + '%' }"
          />
        </div>
      </div>

      <!-- Carbs -->
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-semibold text-yellow-700">Carbs</span>
          <span class="text-sm font-bold text-yellow-700">
            {{ Math.round(userStore.mealPlan.totalCarbs) }}g / {{ userStore.dailyTargets.carbs }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-yellow-600 h-2 rounded-full transition-all"
            :style="{ width: Math.min(macroBreakdown.carbsProgress, 100) + '%' }"
          />
        </div>
      </div>

      <!-- Fat -->
      <div>
        <div class="flex justify-between mb-2">
          <span class="text-sm font-semibold text-red-700">Fat</span>
          <span class="text-sm font-bold text-red-700">
            {{ Math.round(userStore.mealPlan.totalFat) }}g / {{ userStore.dailyTargets.fat }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-red-600 h-2 rounded-full transition-all"
            :style="{ width: Math.min(macroBreakdown.fatProgress, 100) + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        @click="$emit('export-pdf')"
        :disabled="!userStore.planComplete"
        class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
      >
        📄 Export as PDF
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import MealCard from './MealCard.vue'

const userStore = useUserStore()

const macroBreakdown = computed(() => userStore.macroBreakdown)

defineEmits(['generate', 'swap', 'export-pdf'])
</script>

<style scoped>
.meal-plan-summary {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
