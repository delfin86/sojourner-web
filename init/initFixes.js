function updateVh () {
  const screenHeight = window.innerHeight
  document.documentElement.style.setProperty('--screenHeight', `${screenHeight}px`)
}

export default function () {
  // Fix height, see also App.vue style
  // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  updateVh()

  window.addEventListener('resize', updateVh)
}
