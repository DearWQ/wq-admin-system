
export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
}

// @ts-ignore
export function renderThumbStyle({ move, size, bar }) {
  const style = {}
  const translate = `translate${bar.axis}(${move}%)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.webkitTransform = translate

  return style
}

function extend(to, _from) {
  return Object.assign(to, _from)
}

export function toObject(arr) {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export function on(
  element,
  event,
  handler
) {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

/* istanbul ignore next */
export function off(
  element,
  event,
  handler
) {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}
