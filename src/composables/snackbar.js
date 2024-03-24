import { ref } from 'vue'
const snackbar = ref(false)
const snackMessage = ref('')
const snackColor = ref('success')
export function showSnack(msg, color = 'success') {
  snackbar.value = true
  snackMessage.value = msg
  snackColor.value = color
  setTimeout(reset, 3000)
}
const reset = () => {
  snackbar.value = false
  snackMessage.value = ''
}
export { snackbar, snackMessage, snackColor, reset }
