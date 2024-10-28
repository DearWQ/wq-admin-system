
import { toHump } from '@/utils'
export default {
  install(app, options) {
    const { getComponentName } = options
    const components = import.meta.globEager('./**/*.{vue,tsx}')
    Object.keys(components).forEach((it) => {
      const component = components[it]
      app.component(component.default.name || toHump(getComponentName(it)), component.default)
    })
  },
}
