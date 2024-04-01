import { getUser } from '@/modules/database/users'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const id = ref('')
  const displayName = ref('')
  const user = ref({})
  function setId(v) {
    return new Promise((s) => {
      id.value = v
      getUser(v).then((r) => {
        user.value = r
        s()
      })
    })
  }
  function setName(v) {
    displayName.value = v
  }
  return {
    id,
    displayName,
    user,
    setId,
    setName
  }
})
