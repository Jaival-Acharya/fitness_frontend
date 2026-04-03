<template>
  <div class="step-indicator">
    <div
      class="progress-fill"
      :style="{
        width: `${percentage}%`,
      }"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const percentage = computed(() => {
  const stepMap = {
    '/': 25,
    '/details': 50,
    '/diet': 75,
    '/meals': 100,
  }
  return stepMap[route.path] || 0
})
</script>

<style scoped>
.step-indicator {
  position: sticky;
  top: 64px;
  z-index: 40;
  height: 2px;
  background: var(--border);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ef4444;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 1024px) {
  .step-indicator {
    top: 56px;
  }
}

@media (max-width: 768px) {
  .step-indicator {
    top: 52px;
  }
}
</style>
