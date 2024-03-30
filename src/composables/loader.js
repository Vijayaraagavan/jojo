import { ref } from 'vue'

const dialog = ref(false)
const DEFAULT = 'Processing your request. Please wait'
const msg = ref(DEFAULT)
export const useLoader = () => {
  return {
    dialog,
    msg
  }
}

export const loader = {
  start: function (message) {
    msg.value = message
    dialog.value = true
  },
  stop: function () {
    dialog.value = false
    msg.value = DEFAULT
  }
}
