<template>
  <div class="meal-card bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
    <div class="text-center">
      <div class="text-3xl mb-2">{{ emoji }}</div>
      <h3 class="font-bold text-slate-900 mb-3">{{ title }}</h3>

      <div v-if="dish" class="text-left mb-4">
        <div class="font-semibold text-slate-800 text-sm mb-2">{{ dish.name }}</div>
        <div class="text-xs space-y-1 text-slate-600 bg-slate-50 p-2 rounded">
          <div>🔥 {{ dish.calories }} kcal</div>
          <div>🥚 {{ Math.round(dish.protein) }}g protein</div>
          <div>🌾 {{ Math.round(dish.carbs) }}g carbs</div>
          <div>🥑 {{ Math.round(dish.fat) }}g fat</div>
        </div>
      </div>

      <div v-else class="text-slate-400 text-xs py-6 italic">
        No meal selected
      </div>

      <button
        @click="$emit('swap')"
        class="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        {{ dish ? '🔄 Swap' : '➕ Select' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mealType: String,
  emoji: String,
  title: String,
  dish: Object,
})

defineEmits(['swap'])
</script>

<style scoped>
.meal-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.meal-card:hover {
  border-color: #3b82f6;
}
</style>
