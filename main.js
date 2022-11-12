import './style.css'

const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')
ctx.canvas.width = 1024
ctx.canvas.height = 576
const image = new Image()
image.src = './img/little-adventure-map.png'
image.onload = () => {
  ctx.drawImage(image, -240, -700)
}