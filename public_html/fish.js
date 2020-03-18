var FishPopulation = []
class SchoolOfFish {
  constructor(x, y, n, color) {
    this.size = n
    this.hungerState = 0.4
    this.meanPosition = [x, y]
    this.color = color
    this.divergence = [0, 0]
    this.boundaryForce = [0, 0]
    this.meanVelocity = [0, 0]
    this.group = []
    for (let i = 0; i < this.size; i++) {
      this.group.push(new Fish(this))
    }
  }
  boundaryForces() {
    var c = [0, 0]
    let boundarySize = 70
    if (this.meanPosition[0] < boundarySize || this.meanPosition[0] > width - boundarySize || this.meanPosition[1] < boundarySize || this.meanPosition[1] > height - boundarySize) {
      c = vectorDiff([width / 2, height / 2], this.meanPosition)
    }
    return c
  }
  propagate() {
    if (this.hungerState < 0.08)
      for (let c of this.group)
        if (c.size > 7) {
          let a = Math.random()
          if (a < (0.005)) {
            this.group.push(new Fish(this, c))
          }
        }
  }
  refresh() {
    this.size = this.group.length
    let sumX = 0
    let sumY = 0
    let sumVx = 0
    let sumVy = 0
    for (let c of this.group) {
      sumX = sumX + c.position[0]
      sumY = sumY + c.position[1]
      sumVx = sumVx + c.velocity[0]
      sumVy = sumVy + c.velocity[1]
      if (c.size < 7.5) c.size += 0.005
      else if (Math.random() < this.hungerState * this.hungerState / 100) c.die()
    }
    this.meanPosition = [sumX / this.size, sumY / this.size]
    this.meanVelocity = [sumVx / this.size, sumVy / this.size]
    this.boundaryForce = this.boundaryForces()
    this.propagate()
    if (this.hungerState < 1) this.hungerState = this.hungerState + 0.002
    if (this.hungerState < 0.01) this.hungerState = 0.01
  }
}
class Fish {
  constructor(family, parent) {
    this.family = family
    this.size = 7.5
    this.velocity = [30, 0]
    this.instability = 1
    if (parent === undefined) {
      this.position = vectorSum(this.family.meanPosition, [Math.random() * 200 - 100, Math.random() * 200 - 100])
    } else {
      this.position = vectorSum(parent.position, [Math.random() * 1, Math.random() * 1])
      this.size = parent.size / 2
    }
  }
  die() {
    if (this.family.size == 1) FishPopulation.splice(FishPopulation.indexOf(this.family), 1)
    this.family.group.splice(this.family.group.indexOf(this), 1)
  }
  cohesion() {
    let sumX = this.family.meanPosition[0] * this.family.size
    let sumY = this.family.meanPosition[1] * this.family.size
    let dx = ((sumX - this.position[0]) / (this.family.size - 1)) - this.position[0]
    let dy = ((sumY - this.position[1]) / (this.family.size - 1)) - this.position[1]
    return [dx, dy]
  }
  separation() {
    let o = [0, 0]
    for (var c of this.family.group)
      if (c.size > 5 || (this.size < 5 && c.size < 5)) {
        let distVector = vectorDiff(this.position, c.position)
        let vNorm = vectorNorm(distVector)
        if (this != c && vNorm < 80) {
          o = vectorSum(o, vectorScalar(distVector, this.instability * Math.random() * 2 / (vNorm * vNorm)))
        }
      }
    return o
  }
  allignment() {
    let sumOfVelocities = vectorScalar(this.family.meanVelocity, this.family.size)
    let Vx = (sumOfVelocities[0] - this.velocity[0]) / (this.family.size - 1)
    let Vy = (sumOfVelocities[1] - this.velocity[1]) / (this.family.size - 1)
    let meanV = [Vx, Vy]
    return vectorScalar(meanV, 1 / vectorNorm(meanV))
  }
  hunger() {
    let c = [0, 0]
    for (let g of CyanobacteriaPopulation) {
      let minRange = 350
      let point = g.meanPosition
      let vDist = vectorDiff(point, this.position)
      let vNorm = vectorNorm(vDist)
      if (vNorm < minRange) {
        c = vectorSum(c, vectorScalar(vDist, 1 / (vNorm)))
      }
    }
    return c
  }
  curiosity() {
    let c = [0, 0]
    if (mouseIsPressed) {
      let minRange = 400
      let point = [mouseX, mouseY]
      let vDist = vectorDiff(point, this.position)
      let vNorm = vectorNorm(vDist)
      if (vNorm < minRange) {
        c = vectorSum(c, vectorScalar(vDist, 1 / (vNorm)))
      }
    }
    return c
  }
  divergenceForces() {
    let o = [0, 0]
    for (let g of FishPopulation)
      if (g !== this.family) {
        let vectorDist = vectorDiff(this.position, g.meanPosition)
        if (vectorNorm(vectorDist) < 100) {
          o = vectorSum(o, vectorDist)
        }
      }
    let vNorm = vectorNorm(o)
    if (vNorm != 0) this.divergence = vectorScalar(o, 1 / (vNorm * vNorm))
    return o
  }
}

function checkForFood() {
  for (let ff of FishPopulation)
    for (let cf of CyanobacteriaPopulation) {
      let minRange = 250
      let vDist = vectorDiff(cf.meanPosition, ff.meanPosition)
      let vNorm = vectorNorm(vDist)
      if (vNorm < minRange) {
        for (let f of ff.group)
          for (let c of cf.group) {
            if (vectorNorm(vectorDiff(c.position, f.position)) < 5) {
              c.die()
              let foodValue = (9 / (ff.size * ff.size))
              if (foodValue > ff.hungerState) foodValue = ff.hungerState
              if (ff.hungerState > 0.02) ff.hungerState = ff.hungerState - foodValue
            }
          }
      }
    }
}

function updateFishVelocities() {
  let cohesionConst = 1 / 200
  let separationConst = 3
  let allignmentConst = 1 / 10
  let boundariesConst = 1 / 1000
  let divergenceConst = 1 / 100
  let curiosityConst = 1
  let hungerConst = 2
  let momentumConst = 1.3
  for (let g of FishPopulation) {
    g.refresh()
    if (g.hungerState < 0.4) hungerConst = -hungerConst
    let v6 = [0, 0]
    for (let c of g.group) {
      let v1 = vectorScalar(c.cohesion(), cohesionConst)
      if (c.size < 5) v1 = vectorScalar(v1, 10)
      let v2 = vectorScalar(c.separation(), separationConst)
      if (c.size < 5) v2 = vectorScalar(v2, 4 / 5)
      let v3 = vectorScalar(c.allignment(), allignmentConst)
      let v4 = vectorScalar(c.family.boundaryForce, boundariesConst)
      let v5 = vectorScalar(c.divergenceForces(), divergenceConst)
      let v6 = vectorScalar(c.curiosity(), curiosityConst)
      let v7 = vectorScalar(c.hunger(), hungerConst * (g.hungerState / 2))
      let vr = []
      vr.push(v1[0] + v2[0] + v3[0] + v4[0] + v5[0] + v6[0] + v7[0])
      vr.push(v1[1] + v2[1] + v3[1] + v4[1] + v5[1] + v6[1] + v7[1])
      c.velocity[0] = momentumConst * c.velocity[0] + vr[0]
      c.velocity[1] = momentumConst * c.velocity[1] + vr[1]
      let speedLimit = 1.2 + 2.8 * g.hungerState * (1.1 - (g.size * 0.01))
      c.velocity = limitNorm(c.velocity, speedLimit)
    }
  }
  checkForFood()
}

function updateFishPositions() {
  for (let g of FishPopulation) {
    for (let c of g.group) {
      c.position = vectorSum(c.position, c.velocity)
    }
  }
}

function showFish() {
  for (let g of FishPopulation) {
    fill(g.color)
    for (let c of g.group) {
        circle(c.position[0], c.position[1], c.size)
    }
  }
}