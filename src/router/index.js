import { createRouter, createWebHistory } from 'vue-router'
import Screen1BMI from '../screens/Screen1BMI.vue'
import Screen2Details from '../screens/Screen2Details.vue'
import Screen3Diet from '../screens/Screen3Diet.vue'
import Screen4Grid from '../screens/Screen4Grid.vue'

const routes = [
  {
    path: '/',
    name: 'Screen1',
    component: Screen1BMI,
  },
  {
    path: '/details',
    name: 'Screen2',
    component: Screen2Details,
  },
  {
    path: '/diet',
    name: 'Screen3',
    component: Screen3Diet,
  },
  {
    path: '/meals',
    name: 'Screen4',
    component: Screen4Grid,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
