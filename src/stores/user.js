import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const id = ref('')
  function setId(v) {
    id.value = v
  }
  return {
    id,
    setId
  }
})
