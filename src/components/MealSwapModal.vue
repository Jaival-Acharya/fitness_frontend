<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-96 flex flex-col">
      <!-- Header -->
      <div class="border-b border-gray-200 p-5 flex justify-between items-center">
        <h3 class="text-xl font-bold text-slate-900">
          Select {{ mealType === 'breakfast' ? '🌅 Breakfast' : mealType === 'lunch' ? '🍽️ Lunch' : '🌙 Dinner' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Filters -->
      <div class="border-b border-gray-200 p-4 flex gap-2">
        <button
          @click="activeFilter = 'all'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-colors',
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-slate-700 hover:bg-gray-300',
          ]"
        >
          All
        </button>
      </div>

      <!-- Dishes Grid -->
      <div class="overflow-y-auto flex-1 p-4">
        <div v-if="filteredDishes.length === 0" class="text-center py-8 text-slate-500">
          No dishes available
        </div>
        <div v-else class="grid grid-cols-2 gap-3">
          <button
            v-for="dish in filteredDishes"
            :key="dish.id"
            @click="selectDish(dish)"
            class="bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 rounded-lg p-3 text-left transition-all"
          >
            <div class="font-semibold text-slate-900 text-sm mb-2">{{ dish.name }}</div>
            <div class="text-xs space-y-1 text-slate-600">
              <div>🔥 {{ dish.calories }} kcal</div>
              <div>🥚 {{ Math.round(dish.protein) }}g protein</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 p-4 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { getDishes } from '@/api'

const props = defineProps({
  isOpen: Boolean,
  mealType: String,
})

const emit = defineEmits(['close', 'select'])

const userStore = useUserStore()
const activeFilter = ref('all')
const dishes = ref([])
const loading = ref(false)

const filteredDishes = computed(() => {
  return dishes.value.filter((dish) => {
    // Filter by meal type (based on mealType prop)
    const mealTypeMap = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
    }
    const targetMealType = mealTypeMap[props.mealType]
    return dish.meal_type === targetMealType && dish.diet_type === userStore.dietType
  })
})

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await loadDishes()
    }
  }
)

async function loadDishes() {
  try {
    loading.value = true
    const response = await getDishes(userStore.dietType, {
      meal: getMealTypeForAPI(),
      excludeAllergens: userStore.getAllergiesList(),
      sessionId: userStore.sessionId,
    })
    dishes.value = response.data
  } catch (error) {
    console.error('Failed to load dishes:', error)
  } finally {
    loading.value = false
  }
}

function getMealTypeForAPI() {
  const map = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
  }
  return map[props.mealType]
}

function selectDish(dish) {
  emit('select', dish)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
