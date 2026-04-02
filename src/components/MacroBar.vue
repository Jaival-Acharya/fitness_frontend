<template>
  <div class="macros-container">
    <div class="macro-item">
      <div class="macro-icon">🔥</div>
      <div class="macro-info">
        <div class="macro-label">Calories</div>
        <div class="macro-value">{{ calories || '—' }}</div>
      </div>
    </div>
    <div class="macro-item">
      <div class="macro-icon">💪</div>
      <div class="macro-info">
        <div class="macro-label">Protein</div>
        <div class="macro-value">{{ protein || '—' }}g</div>
      </div>
    </div>
    <div class="macro-item">
      <div class="macro-icon">🍞</div>
      <div class="macro-info">
        <div class="macro-label">Carbs</div>
        <div class="macro-value">{{ carbs || '—' }}g</div>
      </div>
    </div>
    <div class="macro-item">
      <div class="macro-icon">🫒</div>
      <div class="macro-info">
        <div class="macro-label">Fats</div>
        <div class="macro-value">{{ fat || '—' }}g</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
})
</script>

<style scoped>
.macros-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.macro-item {
  background: var(--bg3);
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.macro-icon {
  font-size: 1.5rem;
}

.macro-info {
  flex: 1;
}

.macro-label {
  font-size: 12px;
  color: var(--text3);
  margin-bottom: 2px;
}

.macro-value {
  font-size: 16px;
  font-weight: bold;
  font-family: 'Syne', sans-serif;
  color: var(--accent);
}
</style>
