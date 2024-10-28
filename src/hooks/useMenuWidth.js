export function useMenuWidth() {
  const r = document.querySelector(':root')
  const styles = getComputedStyle(r)
  const menuWith = styles.getPropertyValue('--menu-width')
  return parseInt(menuWith)
}

export function useChangeMenuWidth(width) {
  const r = document.querySelector(':root')
  r.style.setProperty('--menu-width', width + 'px')
}
