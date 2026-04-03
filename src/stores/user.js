import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  const targetWeight = ref(null)

  // Meal plan state
  const mealPlan = ref({
    breakfastDish: null,
    lunchDish: null,
    dinnerDish: null,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  })

  // 7-day meal plans
  const weekMealPlan = ref({
    days: 1,
    mealPlans: [],
    weekCalories: 0,
    weekProtein: 0,
    weekCarbs: 0,
    weekFat: 0,
    targetCalories: 0,
  })

  // Daily targets (calculated from fitness goal)
  const dailyTargets = ref({
    calories: 2200,
    protein: 150,
    carbs: 275,
    fat: 73,
  })

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
    targetWeight.value = data.targetWeight ?? null
    allergies.value = Array.isArray(data.allergies)
      ? data.allergies
      : []
    restrictions.value = data.restrictions || allergies.value.join(', ')
    
    // Update daily targets based on fitness goal
    updateDailyTargets(data.fitnessGoal)
  }

  function updateDailyTargets(goal) {
    switch(goal) {
      case 'lose':
        dailyTargets.value = { calories: 1800, protein: 120, carbs: 225, fat: 60 }
        break
      case 'maintain':
        dailyTargets.value = { calories: 2200, protein: 150, carbs: 275, fat: 73 }
        break
      case 'build':
        dailyTargets.value = { calories: 2600, protein: 195, carbs: 325, fat: 87 }
        break
      default:
        dailyTargets.value = { calories: 2200, protein: 150, carbs: 275, fat: 73 }
    }
  }

  function setDiet(type) {
    dietType.value = type
  }

  function setCalorieTarget(target) {
    calorieTarget.value = target
  }

  function setTargetWeight(weight) {
    targetWeight.value = weight
  }

  function setMealPlan(plan) {
    if (plan) {
      mealPlan.value = {
        breakfastDish: plan.breakfast_dish || null,
        lunchDish: plan.lunch_dish || null,
        dinnerDish: plan.dinner_dish || null,
        totalCalories: plan.total_calories || 0,
        totalProtein: plan.total_protein || 0,
        totalCarbs: plan.total_carbs || 0,
        totalFat: plan.total_fat || 0,
      }
    }
  }

  function setWeekMealPlan(plan) {
    if (plan) {
      weekMealPlan.value = {
        days: plan.days || 1,
        mealPlans: plan.meal_plans || [],
        weekCalories: plan.week_calories || 0,
        weekProtein: plan.week_protein || 0,
        weekCarbs: plan.week_carbs || 0,
        weekFat: plan.week_fat || 0,
        targetCalories: plan.target_calories || 0,
      }
    }
  }

  function swapMeal(mealType, dish) {
    if (dish) {
      // Determine the meal being swapped
      let oldDish = null
      switch(mealType) {
        case 'breakfast':
          oldDish = mealPlan.value.breakfastDish
          mealPlan.value.breakfastDish = dish
          break
        case 'lunch':
          oldDish = mealPlan.value.lunchDish
          mealPlan.value.lunchDish = dish
          break
        case 'dinner':
          oldDish = mealPlan.value.dinnerDish
          mealPlan.value.dinnerDish = dish
          break
      }
      
      // Recalculate totals
      recalculateTotals(oldDish, dish)
    }
  }

  function recalculateTotals(oldDish, newDish) {
    if (oldDish) {
      mealPlan.value.totalCalories -= oldDish.calories || 0
      mealPlan.value.totalProtein -= oldDish.protein || 0
      mealPlan.value.totalCarbs -= oldDish.carbs || 0
      mealPlan.value.totalFat -= oldDish.fat || 0
    }

    if (newDish) {
      mealPlan.value.totalCalories += newDish.calories || 0
      mealPlan.value.totalProtein += newDish.protein || 0
      mealPlan.value.totalCarbs += newDish.carbs || 0
      mealPlan.value.totalFat += newDish.fat || 0
    }
  }

  function swapMealInWeekPlan(dayIndex, mealType, newDish) {
    if (dayIndex === null || dayIndex < 0 || dayIndex >= weekMealPlan.value.mealPlans.length) {
      console.error('Invalid day index:', dayIndex)
      return
    }

    const dayPlan = weekMealPlan.value.mealPlans[dayIndex]
    let oldDish = null

    // Get old dish and swap
    switch(mealType) {
      case 'breakfast':
        oldDish = dayPlan.breakfast_dish
        dayPlan.breakfast_dish = newDish
        break
      case 'lunch':
        oldDish = dayPlan.lunch_dish
        dayPlan.lunch_dish = newDish
        break
      case 'dinner':
        oldDish = dayPlan.dinner_dish
        dayPlan.dinner_dish = newDish
        break
    }

    // Recalculate day totals
    const oldCals = oldDish?.calories || 0
    const oldProto = oldDish?.protein || 0
    const oldCarbs = oldDish?.carbs || 0
    const oldFat = oldDish?.fat || 0

    const newCals = newDish?.calories || 0
    const newProto = newDish?.protein || 0
    const newCarbs = newDish?.carbs || 0
    const newFat = newDish?.fat || 0

    dayPlan.total_calories = (dayPlan.total_calories || 0) - oldCals + newCals
    dayPlan.total_protein = (dayPlan.total_protein || 0) - oldProto + newProto
    dayPlan.total_carbs = (dayPlan.total_carbs || 0) - oldCarbs + newCarbs
    dayPlan.total_fat = (dayPlan.total_fat || 0) - oldFat + newFat

    // Recalculate week totals
    weekMealPlan.value.weekCalories = weekMealPlan.value.mealPlans.reduce((sum, plan) => sum + (plan.total_calories || 0), 0)
    weekMealPlan.value.weekProtein = weekMealPlan.value.mealPlans.reduce((sum, plan) => sum + (plan.total_protein || 0), 0)
    weekMealPlan.value.weekCarbs = weekMealPlan.value.mealPlans.reduce((sum, plan) => sum + (plan.total_carbs || 0), 0)
    weekMealPlan.value.weekFat = weekMealPlan.value.mealPlans.reduce((sum, plan) => sum + (plan.total_fat || 0), 0)
  }

  // Getters
  const macroBreakdown = computed(() => ({
    calorieProgress: dailyTargets.value.calories > 0 
      ? (mealPlan.value.totalCalories / dailyTargets.value.calories) * 100 
      : 0,
    proteinProgress: dailyTargets.value.protein > 0 
      ? (mealPlan.value.totalProtein / dailyTargets.value.protein) * 100 
      : 0,
    carbsProgress: dailyTargets.value.carbs > 0 
      ? (mealPlan.value.totalCarbs / dailyTargets.value.carbs) * 100 
      : 0,
    fatProgress: dailyTargets.value.fat > 0 
      ? (mealPlan.value.totalFat / dailyTargets.value.fat) * 100 
      : 0,
  }))

  const planComplete = computed(() => 
    mealPlan.value.breakfastDish && 
    mealPlan.value.lunchDish && 
    mealPlan.value.dinnerDish
  )

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
    targetWeight.value = null
    mealPlan.value = {
      breakfastDish: null,
      lunchDish: null,
      dinnerDish: null,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    }
    weekMealPlan.value = {
      days: 1,
      mealPlans: [],
      weekCalories: 0,
      weekProtein: 0,
      weekCarbs: 0,
      weekFat: 0,
      targetCalories: 0,
    }
    dailyTargets.value = {
      calories: 2200,
      protein: 150,
      carbs: 275,
      fat: 73,
    }
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
    targetWeight,
    mealPlan,
    weekMealPlan,
    dailyTargets,
    setBMI,
    setSession,
    setDetails,
    setDiet,
    setCalorieTarget,
    setTargetWeight,
    setMealPlan,
    setWeekMealPlan,
    swapMeal,
    swapMealInWeekPlan,
    getAllergiesList,
    macroBreakdown,
    planComplete,
    reset,
  }
})
