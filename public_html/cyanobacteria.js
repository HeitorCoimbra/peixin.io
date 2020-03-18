var CyanobacteriaPopulation = []
class Cyanobacteria { 
  constructor(x, y, n) {
    this.divergence = [0, 0] 
    this.group = [] 
    this.size = n 
    this.reproductionRate = 0
    this.meanPosition = [x, y]
    for (let i = 0; i < this.size; i++) {
      this.group.push(new Cell(this))
    }
  }
  refresh() {
    let sumX = 0
    let sumY = 0
    for (let c of this.group) {
      sumX = sumX + c.position[0]
      sumY = sumY + c.position[1]
    }
    this.meanPosition = [sumX / this.size, sumY / this.size] 
    this.propagate()
    this.reproductionRate = 0.98 - this.size / 200 
    if (this.size < 30) this.reproductionRate = 0 // 
    this.calculateDivergence()
    this.size = this.group.length
  }
  calculateDivergence(){ 
    for (let g of CyanobacteriaPopulation) {
      let vectorDist = vectorDiff(this.meanPosition, g.meanPosition)
      let vNorm = vectorNorm(vectorDist)
      if (vNorm < 100) { 
        this.divergence = vectorSum(this.divergence, vectorDist)
      }
    }
    if (vectorNorm(this.divergence) != 0) this.divergence = vectorScalar(this.divergence, 1 / vectorNorm(this.divergence)) 
  }
  propagate() {
    for (let c of this.group) { 
      let a = Math.random()
      if (this.reproductionRate > 0)
        if (Math.random() < (this.reproductionRate)) {
          this.group.push(new Cell(this, c))
          this.group.push(new Cell(this, c))
          c.die()
        }
      else { 
        if (-Math.random() > this.reproductionRate) c.die()
      }
    }
  }
}
class Cell {
  constructor(family, parent) {
    this.size = Math.random() * 1.5 + 1.5 
    this.family = family 
    this.instability = Math.random() 
    this.velocity = [0, 0]  
    if (parent === undefined) {
      this.position = vectorSum(this.family.meanPosition, [Math.random() * 350 - 175, Math.random() * 350 - 175])
    } else {                    
      this.position = vectorSum(parent.position, [Math.random(), Math.random()])
    }
  }

  actingForces() {
    let cohesion = vectorScalar(this.cohesion(), 0.6)
    let separation = vectorScalar(this.separation(), 10000 * this.instability)
    let divergence = vectorScalar(this.family.divergence, 100)
    let actingForces = []
    actingForces.push(cohesion[0] + separation[0] + divergence[0])
    actingForces.push(cohesion[1] + separation[1] + divergence[1])
    return actingForces
  }
  cohesion() {
    return vectorDiff(this.family.meanPosition, this.position)
  }
  separation() {
    var o = [0, 0]
    for (var c of this.family.group) {
      let distVector = vectorDiff(this.position, c.position)
      let vNorm = vectorNorm(distVector)
      if (this != c && vNorm < 100) {
        o = vectorSum(o, vectorScalar(distVector, 1 / (vNorm * vNorm * vNorm)))
      }
    }
    return o
  }
  die() {
    this.family.group.splice(this.family.group.indexOf(this), 1)
  }
}

function updateCyanobacteriaVelocities() {
  for (let g of CyanobacteriaPopulation) {
    g.refresh()
    for (let c of g.group) {
      let actingForces = c.actingForces()
      c.velocity[0] = c.velocity[0] + actingForces[0]
      c.velocity[1] = c.velocity[1] + actingForces[1]
      c.velocity = limitNorm(c.velocity, 0.05)
    }
  }
}

function updateCyanobacteriaPositions() {
  for (let g of CyanobacteriaPopulation)
    for (let c of g.group)
      c.position = vectorSum(c.position, c.velocity)
}

function showCyanobacteria() {
  fill(color(80, 255, 130))
  for (let g of CyanobacteriaPopulation) {
    for (let c of g.group) {
      circle(c.position[0], c.position[1], c.size)
    }
  }
}