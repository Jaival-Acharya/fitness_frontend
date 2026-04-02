<template>
  <div class="app">
    <NavBar />
    <StepIndicator />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition
          :name="transitionName"
          mode="out-in"
        >
          <component :is="Component" :key="$route.path" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import StepIndicator from './components/StepIndicator.vue'

const route = useRoute()

const routeOrder = {
  '/': 1,
  '/details': 2,
  '/diet': 3,
  '/meals': 4,
}

const transitionName = ref('slide-forward')
let previousOrder = routeOrder[route.path] || 0

watch(
  () => route.path,
  (newPath) => {
    const currentOrder = routeOrder[newPath] || 0
    transitionName.value = currentOrder < previousOrder
      ? 'slide-back'
      : 'slide-forward'
    previousOrder = currentOrder
  }
)
</script>

<style scoped>
.app {
  background-color: #f7f7f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 40px;
  overflow-y: auto;
}

.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.3s ease;
}

.slide-forward-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-forward-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-back-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-back-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

