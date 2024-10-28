import { findAffixedRoutes } from '@/store/help'
import useVisitedRouteStore from '@/store/modules/visited-routes'
import router from '..'

function useVisitedGuard() {
  router.beforeEach((to) => {
    if (['404', '500', '403', 'not-found', 'Login'].includes(to.name)) {
      return true
    }
    const visitedRouteStore = useVisitedRouteStore()
    if (!visitedRouteStore.isLoadAffix) {
      const affixRoutes = findAffixedRoutes(router.getRoutes())
      visitedRouteStore.initAffixRoutes(affixRoutes)
    }
    if (to.path.startsWith('/redirect')) {
      return true
    }
    if (to.meta.noShowTabbar) {
      return true
    }
    if (to.query?.noShowTabbar) {
      return true
    }
    visitedRouteStore.addVisitedRoute(to)
    return true
  })
}

export default useVisitedGuard
