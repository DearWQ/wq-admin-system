import '../styles/transition.css'
import { TinyEmitter } from 'tiny-emitter'

import { toHump } from '@/utils'
import components from '../components'

import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVue from '@arco-design/web-vue/es/arco-vue'

function getComponentName(key) {
  if (!key) {
    return ''
  }
  const paths = key.split('/')
  const name = paths
    .filter((it) => !!it && it !== '.')
    .reverse()
    .find(
      (it) =>
        it !== 'index.vue' &&
        it !== 'index.js' &&
        it !== 'index.js' &&
        it !== 'index.jsx' &&
        it !== 'index.tsx'
    )
    ?.replace('.vue', '')
    ?.replace('.tsx', '')
  return name || ''
}

export function registerComponents(app) {
  const components = import.meta.globEager('./**/**.{vue,tsx}')
  Object.keys({ ...components }).forEach((it) => {
    const component = components[it]
    app.component(component.default.name || toHump(getComponentName(it)), component.default)
  })
}

export const emitKey = Symbol('tiny-emit')

function install(app) {
  app.use(ArcoVue)
  app.use(ArcoVueIcon)
  registerComponents(app)
  app.use(components, { getComponentName })
  app.provide(emitKey, new TinyEmitter())
}

export function setupGlobalComponent(app) {
  install(app)
}
