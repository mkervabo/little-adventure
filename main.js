import './style.css'
import { collisions } from './data/collision.js'

const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')
ctx.canvas.width = 1024
ctx.canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
}

class Boundary {
  static width = 48
  static height = 48
  constructor({position}) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height )
  }
}

const offset = {
  x: -210,
  y: -760,
}
const boundaries = []
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol == 1025)
      boundaries.push(new Boundary(
        { position: { x: j * Boundary.width + offset.x, y: i * Boundary.height + offset.y}}
      ))
  })
})
console.log(boundaries)

const image = new Image()
image.src = './img/little-adventure-map.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }}) {
    this.position = position
    this.image = image
    this.frames = frames
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height)
  }
}

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image
})

const player = new Sprite({
  position: {
    x: canvas.width / 2 - (playerImage.width / 4) / 2,
    y: canvas.height / 2 - playerImage.height / 2,
  },
  image: playerImage,
  frames: { max: 4 }
})

const keys = {
  up: {
    pressed: false
  },
  left: {
    pressed: false
  },
  down: {
    pressed: false
  },
  right: {
    pressed: false
  },
}

const movables = [background, ...boundaries]

const rectangularCollision = ({ rec1, rec2 }) => {
  return (rec1.position.x + rec1.width >= rec2.position.x
    && rec1.position.x <= rec2.position.x + rec2.width
    && rec1.position.y + rec1.height >= rec2.position.y
    && rec1.position.y <= rec2.position.y + rec2.height / 2)
}

const moving = ({ x, y}) => {
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
      rectangularCollision({
        rec1: player,
        rec2: {...boundary,
          position: {
            x: boundary.position.x + x,
            y: boundary.position.y + y
          }
        }
      })
    ) {
      return false
    }
  }
  return true
}

const animate = () => {
  window.requestAnimationFrame(animate)
  background.draw()
  boundaries.forEach(boundary => {
    boundary.draw()
  })
  player.draw()

  if (keys.up.pressed && lastKey === 'up' && moving({ x: 0, y: 2 })) {
      movables.forEach(movable => movable.position.y += 2)
  }
  else if (keys.down.pressed && lastKey === 'down' && moving({ x: 0, y: -2 })){
    movables.forEach(movable => movable.position.y -= 2)
  }
  else if (keys.left.pressed && lastKey === 'left' && moving({ x: 2, y: 0})){
    movables.forEach(movable => movable.position.x += 2)
  }
  else if (keys.right.pressed && lastKey === 'right' && moving({ x: -2, y: 0})){
    movables.forEach(movable => movable.position.x -= 2)
  }
}
let lastKey = ''
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keys.up.pressed = true
      lastKey = 'up'
      break
    case 'a':
    case 'ArrowLeft':
      keys.left.pressed = true
      lastKey = 'left'
      break
    case 's':
    case 'ArrowDown':
      keys.down.pressed = true
      lastKey = 'down'
      break
    case 'd':
    case 'ArrowRight':
      keys.right.pressed = true
      lastKey = 'right'
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keys.up.pressed = false
      break
    case 'a':
    case 'ArrowLeft':
      keys.left.pressed = false
      break
    case 's':
    case 'ArrowDown':
      keys.down.pressed = false
      break
    case 'd':
    case 'ArrowRight':
      keys.right.pressed = false
      break
  }
})

animate()