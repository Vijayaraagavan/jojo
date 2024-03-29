import { useUserStore } from '@/stores/user'
import { getSettings, saveSettings, newSettings } from '@/modules/database/settings'
import { useSettingsStore } from './settings'

export const start = () => {
  return new Promise((s) => {
    const store = useUserStore()
    setCategories(store.id)
    s()
  })
}

const setCategories = (id) => {
  const settingsStore = useSettingsStore()

  getSettings(id)
    .then((setting) => {
      settingsStore.saveSettings(setting)
    })
    .catch((msg) => {
      if (msg.includes('no settings')) {
        if (id) {
          const payload = {
            uid: id,
            individual: true,
            pkey: 1,
            categories: []
          }
          newSettings().then(() => {
            settingsStore.saveSettings(payload)
          })
        }
      }
    })
}
