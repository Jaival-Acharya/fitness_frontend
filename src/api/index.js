import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const calculateBMI = (weight, height) =>
  api.post('/bmi', { weight, height })

export const updateSession = (id, data) =>
  api.patch(`/sessions/${id}`, data)

export const getDishes = (diet, options = {}) => {
  const {
    meal = null,
    excludeAllergens = [],
    sessionId = null,
  } = options

  const params = { diet }
  if (meal) params.meal = meal
  if (sessionId) params.session_id = sessionId
  if (excludeAllergens.length > 0) {
    params.exclude_allergens = excludeAllergens.join(',')
  }
  return api.get('/dishes', { params })
}

export const getDishById = (id) =>
  api.get(`/dish/${id}`)

export const getCategories = () =>
  api.get('/categories')

// Meal Plan APIs
export const suggestMealPlan = (sessionId, fitnessGoal, dietType) =>
  api.post('/meal-plans/suggest', {
    session_id: sessionId,
    fitness_goal: fitnessGoal,
    diet_type: dietType,
  })

export const suggestWeekMealPlan = (sessionId, fitnessGoal, dietType, days) =>
  api.post('/meal-plans/suggest-week', {
    session_id: sessionId,
    fitness_goal: fitnessGoal,
    diet_type: dietType,
    days: days,
  })

export const saveMealPlan = (sessionId, breakfastDishId, lunchDishId, dinnerDishId) =>
  api.post('/meal-plans/save', {
    session_id: sessionId,
    breakfast_dish_id: breakfastDishId,
    lunch_dish_id: lunchDishId,
    dinner_dish_id: dinnerDishId,
  })

export const getMealPlan = (sessionId) =>
  api.get(`/meal-plans/${sessionId}`)

export const exportMealPlanPDF = (sessionId, breakfastDishId = null, lunchDishId = null, dinnerDishId = null) =>
  api.post(`/meal-plans/${sessionId}/export-pdf`, {
    breakfast_dish_id: breakfastDishId,
    lunch_dish_id: lunchDishId,
    dinner_dish_id: dinnerDishId,
  }, {
    responseType: 'blob',
  })

export default api
