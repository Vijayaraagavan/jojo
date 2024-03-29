import { computed } from 'vue'

import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({})
  function saveSettings(v) {
    settings.value = v
  }
  const setCategories = (v) => {
    settings.value.categories = v
  }
  const categories = computed(() => {
    return settings.value.categories
  })
  return {
    settings,
    categories,
    saveSettings,
    setCategories
  }
})
