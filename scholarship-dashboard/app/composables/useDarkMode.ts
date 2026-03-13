import { ref } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  function toggleDark() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, toggleDark }
}
