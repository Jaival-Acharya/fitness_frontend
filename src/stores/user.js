import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const sessionId = ref(localStorage.getItem('fitfuel_session') || null)
  const bmi = ref(null)
  const category = ref(null)
  const weight = ref(null)
  const height = ref(null)
  const age = ref(null)
  const heartRate = ref(null)
  const gender = ref(null)
  const activityLevel = ref('sedentary')
  const fitnessGoal = ref('maintain')
  const dietType = ref('veg')
  const allergies = ref([])
  const restrictions = ref('')
  const calorieTarget = ref(null)

  function setSession(id) {
    sessionId.value = id
    localStorage.setItem('fitfuel_session', id)
  }

  function setBMI(data) {
    bmi.value = data.bmi
    category.value = data.category
    weight.value = data.weight
    height.value = data.height
    setSession(data.sessionId)
  }

  function setDetails(data) {
    age.value = data.age
    heartRate.value = data.heartRate ?? heartRate.value
    gender.value = data.gender
    activityLevel.value = data.activityLevel
    fitnessGoal.value = data.fitnessGoal
    allergies.value = Array.isArray(data.allergies)
      ? data.allergies
      : []
    restrictions.value = data.restrictions || allergies.value.join(', ')
  }

  function setDiet(type) {
    dietType.value = type
  }

  function setCalorieTarget(target) {
    calorieTarget.value = target
  }

  function getAllergiesList() {
    if (allergies.value.length > 0) {
      return allergies.value
    }
    if (!restrictions.value) return []

    return restrictions.value
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  }

  function reset() {
    localStorage.removeItem('fitfuel_session')
    sessionId.value = null
    bmi.value = null
    category.value = null
    weight.value = null
    height.value = null
    age.value = null
    heartRate.value = null
    gender.value = null
    activityLevel.value = 'sedentary'
    fitnessGoal.value = 'maintain'
    dietType.value = 'veg'
    allergies.value = []
    restrictions.value = ''
    calorieTarget.value = null
  }

  return {
    sessionId,
    bmi,
    category,
    weight,
    height,
    age,
    heartRate,
    gender,
    activityLevel,
    fitnessGoal,
    dietType,
    allergies,
    restrictions,
    calorieTarget,
    setSession,
    setBMI,
    setDetails,
    setDiet,
    setCalorieTarget,
    getAllergiesList,
    reset,
  }
})
