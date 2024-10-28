export default function useGray(isGray) {
  const html = document.querySelector('html')
  const style = html.style
  style.filter = `grayscale(${isGray ? 1 : 0})`
}
