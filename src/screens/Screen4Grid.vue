<template>
  <div class="grid-wrapper">
    <h1 class="heading-display">Your personalised meal plan</h1>
    <p class="body-secondary">Showing {{ userStore.dietType }} meals</p>

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
        @click="openRecipe(dish)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No dishes found. Try a different filter.</p>
    </div>

    <!-- Recipe Modal -->
    <RecipeModal
      :is-open="modalOpen"
      :recipe="selectedRecipe"
      @close="modalOpen = false"
    />

    <!-- Buttons -->
    <div class="button-row">
      <button class="btn-secondary" @click="goBack">← Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { getDishes, getDishById } from '../api'
import DishCard from '../components/DishCard.vue'
import RecipeModal from '../components/RecipeModal.vue'

const router = useRouter()
const userStore = useUserStore()

const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack']
const selectedMeal = ref('All')
const dishes = ref([])
const loading = ref(true)
const error = ref('')
const modalOpen = ref(false)
const selectedRecipe = ref({})

const filteredDishes = computed(() => dishes.value)

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

</script>

<style scoped>
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

.filter-chips {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.chip {
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.chip-default {
  background: transparent;
  border-color: #d1d5db;
  color: #6b7280;
}

.chip-default:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.chip-active {
  background: #ef4444;
  border-color: #ef4444;
  color: #ffffff;
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.skeleton-card {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  height: 200px;
  animation: pulse 2s infinite;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 13px;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin-top: 32px;
}

.btn-primary,
.btn-secondary {
  height: 34px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
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

.btn-secondary {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #d1d5db;
  transform: translateY(-1px);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

