<template>
  <div
    class="dish-card"
    @click="$emit('click')"
  >
    <!-- Emoji Display -->
    <div class="emoji-display">
      {{ dish.emoji }}
    </div>

    <!-- Dish Name -->
    <h3 class="dish-name">{{ dish.name }}</h3>

    <!-- Chips -->
    <div class="chips-row">
      <div class="chip">
        <span>🔥</span> {{ dish.calories }} kcal
      </div>
      <div class="chip">
        <span>⏱</span> {{ dish.prep_time }}
      </div>
      <div class="chip">
        <span>🍽</span> {{ dish.meal_type }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dish: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.dish-card {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.dish-card:hover {
  transform: translateY(-2px);
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08);
}

.emoji-display {
  width: 100%;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: #f3f4f6;
  border-bottom: 1px solid #d1d5db;
}

.dish-name {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  padding: 12px 12px 8px;
  margin: 0;
  font-family: var(--font-family);
  line-height: 1.3;
}

.chips-row {
  display: flex;
  gap: 6px;
  padding: 0 12px 12px;
  flex-wrap: wrap;
}

.chip {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
}
</style>

