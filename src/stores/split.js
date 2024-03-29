import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSplitStore = defineStore('split', () => {
  let split = ref(null)
  function setSplit(obj) {
    split.value = obj
  }
  return {
    split,
    setSplit
  }
})
