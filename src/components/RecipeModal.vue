<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <!-- Handle Bar -->
          <div class="modal-handle" />

          <!-- Close Button -->
          <button
            class="close-btn"
            @click="closeModal"
            aria-label="Close modal"
          >
            ✕
          </button>

          <!-- Emoji Display -->
          <div class="emoji-large">{{ recipe.emoji }}</div>

          <!-- Title -->
          <h2 class="recipe-title">{{ recipe.name }}</h2>

          <!-- Description -->
          <p class="recipe-description">{{ recipe.description }}</p>

          <!-- Chips -->
          <div class="chips-row">
            <div class="chip">
              <span>🔥</span> {{ recipe.calories }} kcal
            </div>
            <div class="chip">
              <span>⏱</span> {{ recipe.prep_time }}
            </div>
            <div class="chip">
              <span>📊</span> {{ recipe.difficulty }}
            </div>
            <div class="chip">
              <span>🍽</span> {{ recipe.meal_type }}
            </div>
          </div>

          <!-- Macros Section -->
          <div class="section-title">Per Serving</div>
          <div class="macros-grid">
            <div class="macro-card">
              <div class="macro-value">{{ recipe.calories }}</div>
              <div class="macro-label">Calories</div>
            </div>
            <div class="macro-card">
              <div class="macro-value">{{ recipe.protein }}<span class="unit">g</span></div>
              <div class="macro-label">Protein</div>
            </div>
            <div class="macro-card">
              <div class="macro-value">{{ recipe.carbs }}<span class="unit">g</span></div>
              <div class="macro-label">Carbs</div>
            </div>
            <div class="macro-card">
              <div class="macro-value">{{ recipe.fat }}<span class="unit">g</span></div>
              <div class="macro-label">Fats</div>
            </div>
          </div>

          <!-- Ingredients Section -->
          <div class="section-title">Ingredients</div>
          <div class="ingredients-list">
            <div v-for="(ingredient, idx) in parsedIngredients" :key="idx" class="ingredient-item">
              <span class="bullet">●</span> {{ ingredient }}
            </div>
          </div>

          <!-- Method Section -->
          <div class="section-title">recipe</div>
          <div class="steps-list">
            <div v-for="(step, idx) in parsedSteps" :key="idx" class="step-item">
              <div class="step-number">{{ idx + 1 }}</div>
              <div>{{ step }}</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  recipe: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])

const parsedIngredients = computed(() => {
  if (!props.recipe.ingredients) return []
  try {
    if (typeof props.recipe.ingredients === 'string') {
      return JSON.parse(props.recipe.ingredients)
    }
    return props.recipe.ingredients
  } catch {
    return []
  }
})

const parsedSteps = computed(() => {
  if (!props.recipe.steps) return []
  try {
    if (typeof props.recipe.steps === 'string') {
      return JSON.parse(props.recipe.steps)
    }
    return props.recipe.steps
  } catch {
    return []
  }
})

function closeModal() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(31, 41, 55, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  padding: 0 20px 20px;
}

.modal-content {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  padding: 24px 20px 20px 20px;
  width: 100%;
  max-width: 880px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  margin: 0 auto;
}

.modal-handle {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #ef4444;
}

.emoji-large {
  font-size: 48px;
  text-align: center;
  margin-bottom: 12px;
}

.recipe-title {
  font-family: var(--font-family);
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.recipe-description {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.chips-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.chip {
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.section-title {
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  margin: 20px 0 12px 0;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.macros-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.macro-card {
  background: #f9faf9;
  border: 1px solid #d1d5db;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}

.macro-value {
  font-size: 16px;
  font-weight: 600;
  color: #ef4444;
}

.unit {
  font-size: 11px;
  color: #9ca3af;
  margin-left: 2px;
}

.macro-label {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.ingredient-item {
  font-size: 13px;
  color: #1f2937;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.bullet {
  color: #ef4444;
  flex-shrink: 0;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.step-item {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #1f2937;
}

.step-number {
  min-width: 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fee2e2;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 11px;
  flex-shrink: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%);
}

@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-end;
    justify-content: center;
    padding: 0 16px 16px;
  }

  .modal-content {
    border-bottom: none;
    border-radius: 12px 12px 0 0;
  }

  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: translateY(100%);
  }

  .macros-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

