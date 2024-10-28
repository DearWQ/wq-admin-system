import { isObject } from '@vueuse/core'
import { toRaw } from 'vue'

export default ({ options, store }) => {
  const presist = options.presist
  if (presist && isObject(presist) && presist.enable) {
    // 设置默认值
    !presist.option && (presist.option = {})

    const key = presist.option?.key || store.$id
    presist.option.key = key
    const storage = presist.option?.storage || 'local'
    presist.option.storage = storage

    // 恢复状态
    if (presist.resetToState) {
      if (typeof presist.resetToState === 'boolean') {
        const json = (window)[presist.option?.storage + 'Storage'].getItem(
          presist.option?.key
        )
        if (json) {
          store.$patch(JSON.parse(json))
        }
      } else if (typeof presist.resetToState === 'function') {
        presist.resetToState.call(presist, store)
      }
    }

    // 设置监听器
    store.$subscribe(
      (mutation, state) => {
        const toPersistObj = JSON.parse(JSON.stringify(toRaw(state)))
        if (presist.option?.include || presist.option?.exclude) {
          Object.keys(toPersistObj).forEach((it) => {
            if (
              (presist.option?.include && !presist.option?.include?.includes(it)) ||
              (presist.option?.exclude && presist.option?.exclude?.includes(it))
            ) {
              toPersistObj[it] = undefined
            }
          })
        }
        ; (window)[storage + 'Storage'].setItem(key, JSON.stringify(toPersistObj))
      },
      { detached: true }
    )
  }
}
