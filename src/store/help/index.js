import { isExternal, toHump } from '@/utils'
import { resolve } from 'path-browserify'
import { ref } from 'vue'

import { asyncRoutes } from '@/router/routes/async'
import { LAYOUT } from '../keys'

export function loadComponents() {
  return import.meta.glob('/src/views/**/*.vue')
}

export const asynComponents = loadComponents()

export function getComponent(it) {
  return asynComponents[getFilePath(it)]
}

export function getFilePath(it) {
  if (!it.localFilePath) {
    it.localFilePath = it.menuUrl
  }
  it.localFilePath = resolve('/', it.localFilePath)
  return '/src/views' + it.localFilePath + '.vue'
}

export function findRootPathRoute(routes) {
  for (let index = 0; index < routes.length; index++) {
    const route = routes[index]
    const rootRoute = route.children?.find((it) => it.meta && it.meta.isRootPath)
    if (rootRoute) {
      return rootRoute.path
    }
  }
  return routes && routes.length > 0 && routes[0].children && routes[0].children.length > 0
    ? routes[0].children[0].path
    : '/'
}

export function filterRoutesFromLocalRoutes(
  route,
  localRoutes,
  path = '/'
) {
  const filterRoute = localRoutes.find((it) => {
    return resolve(path, it.path) === route.menuUrl
  })
  if (filterRoute) {
    filterRoute.meta = {
      title: route.menuName,
      affix: !!route.affix,
      cacheable: !!route.cacheable,
      icon: route.icon || 'icon-menu',
      badge: route.badge,
      hidden: !!route.hidden,
      isRootPath: !!route.isRootPath,
      isSingle: !!route.isSingle,
      ...filterRoute.meta,
    }
    const parentPath = resolve(path, filterRoute.path)
    if (
      Array.isArray(route.children) &&
      route.children.length > 0 &&
      Array.isArray(filterRoute.children) &&
      filterRoute.children.length > 0
    ) {
      const tempChildren= []
      route.children.forEach((it) => {
        const childFilterRoute = filterRoutesFromLocalRoutes(it, filterRoute.children, parentPath)
        childFilterRoute && tempChildren.push(childFilterRoute)
      })
      filterRoute.children = tempChildren
    }
  }
  return filterRoute
}

export function isMenu(it) {
  return it.children && it.children.length > 0
}

export function getNameByUrl(menuUrl) {
  const temp = menuUrl.split('/')
  return toHump(temp[temp.length - 1])
}

export function generatorRoutes(res) {
  const tempRoutes = []
  res.forEach((it) => {
    const isMenuFlag = isMenu(it)
    const localRoute = isMenuFlag ? filterRoutesFromLocalRoutes(it, asyncRoutes) : null
    if (localRoute) {
      tempRoutes.push(localRoute)
    } else {
      const route = {
        path: it.outLink && isExternal(it.outLink) ? it.outLink : it.menuUrl,
        name: it.routeName || getNameByUrl(it.menuUrl),
        component: isMenuFlag ? LAYOUT : getComponent(it),
        meta: {
          hidden: !!it.hidden,
          title: it.menuName,
          affix: !!it.affix,
          cacheable: !!it.cacheable,
          icon: it.icon || 'icon-menu',
          badge: it.badge,
          isRootPath: !!it.isRootPath,
          isSingle: !!it.isSingle,
        },
      }
      if (it.children) {
        // @ts-ignore
        route.children = generatorRoutes(it.children)
      }
      tempRoutes.push(route)
    }
  })
  return tempRoutes
}

export function mapTwoLevelRouter(srcRoutes) {
  function addParentRoute(routes, parent, parentPath) {
    routes.forEach((it) => {
      if (!isExternal(it.path)) {
        it.path = resolve(parentPath, it.path)
      }
      parent.push(it)
      if (it.children && it.children.length > 0) {
        addParentRoute(it.children, parent, it.path)
      }
    })
  }
  if (srcRoutes && srcRoutes.length > 0) {
    const tempRoutes = []
    srcRoutes.forEach((it) => {
      const route = { ...it }
      const parentRoutes = []
      if (route.children && route.children.length > 0) {
        addParentRoute(route.children, parentRoutes, route.path)
      }
      parentRoutes && parentRoutes.length > 0 && (route.children = parentRoutes)
      tempRoutes.push(route)
    })
    return tempRoutes
  }
  return []
}

export function findAffixedRoutes(routes) {
  const temp = []
  routes.forEach((it) => {
    if (it.meta && it.meta.affix) {
      temp.push(it)
    }
  })
  return temp
}

export function findCachedRoutes(routes) {
  const temp = []
  routes.forEach((it) => {
    if (it.name && it.meta && it.meta.cacheable) {
      temp.push(it.name)
    }
  })
  return temp
}

export function transfromMenu(originRoutes) {
  if (!originRoutes) {
    return []
  }
  const tempMenus = []
  originRoutes
    .filter((it) => (it.meta ? !it.meta.hidden : true))
    .forEach((it) => {
      const tempMenu = {
        key: it.path,
        label: it.meta?.title,
        icon: it.meta?.icon,
        children: null,
      }
      if (it.children) {
        if (it.meta && it.meta.isSingle && it.children.length === 1) {
          const lastItem = it.children[0]
          tempMenu.key = lastItem.path || tempMenu.key
          tempMenu.label = (
            lastItem.meta && lastItem.meta.title ? lastItem.meta?.title : tempMenu.label
          )
          tempMenu.icon = (
            lastItem.meta && lastItem.meta.icon ? lastItem.meta?.icon : tempMenu.icon
          )
          tempMenu.children = null
        } else {
          tempMenu.children = transfromMenu(it.children)
        }
      }
      tempMenus.push(tempMenu)
    })
  return tempMenus
}

export function transformSplitTabMenu(routes) {
  const tempTabs = []
  routes.forEach((it) => {
    const splitTab = {
      label: it.meta ? (it.meta?.title ) : '',
      fullPath: it.path || '',
      iconPrefix: it.meta?.iconPrefix || 'icon',
      icon: it.meta ? (it.meta?.icon ) : undefined,
      children: it.children,
      checked: ref(false),
    }
    tempTabs.push(splitTab)
  })
  return tempTabs
}

export function findRouteByUrl(routes, path){
  if (!path || !routes) {
    return null
  }
  let tempRoute = null
  for (let index = 0; index < routes.length; index++) {
    const temp = routes[index]
    if (temp.path === path) {
      tempRoute = temp
      return tempRoute
    }
    if (temp.children) {
      tempRoute = findRouteByUrl(temp.children, path)
      if (tempRoute) {
        return tempRoute
      }
    }
  }
  return null
}
