let x = 0
function draw() {
  ctx.translate(x, 0)
  ctx.clearRect(0,0,10,10)
}
function update(dt) {
  x *= Math.pow(0.001, dt)
}
export { draw, update }
