import { toHump } from '@/utils'
import { defineStore } from 'pinia'

const useCachedRouteStore = defineStore('cached-routes', {
  state: () => {
    return {
      cachedRoutes: [],
    }
  },
  getters: {
    getCachedRouteName(state) {
      return state.cachedRoutes
    },
  },
  actions: {
    initCachedRoute(routes) {
      this.cachedRoutes = routes.map((it) => {
        return toHump(it)
      })
    },
    setCachedRoutes(cachedRoutes = []) {
      this.cachedRoutes = cachedRoutes
    },
    resetCachedRoutes() {
      this.$reset()
    },
  },
})

export default useCachedRouteStore
