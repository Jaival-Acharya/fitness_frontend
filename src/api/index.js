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

export default api
