import { createPinia } from 'pinia'

import persist from './plugin/persist'

const pinia = createPinia()
pinia.use(persist)

export function setupPinia(app) {
  app.use(pinia)
}

export default pinia
