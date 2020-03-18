function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke()
  textSize(16)
}
function draw() {
  background(0,20,80)
  updateAllVelocities()
  updateAllPositions()
  showAllBeings()
  showInfo()
  showInterface()
}
function updateAllVelocities(){
  if (frameCount==30 || frameCount%90==0) updateCyanobacteriaVelocities()
  if(frameCount%3==0)updateFishVelocities()
}

function updateAllPositions(){
  updateCyanobacteriaPositions()
  updateFishPositions()
}
function showAllBeings(){
  showCyanobacteria()
  showFish()
}
function showInfo(){
  textSize(16)
  fill(255)
  text('Press x to spawn a school of Fish',20,20) 
  text('Press c to spawn a population of Cyanobacteria',20,40)
  text('Press and hold your mouse down near wandering fish to spark their curiosity',20,60)
 for(let f of FishPopulation){
    fill(f.color)
   text((f.hungerState.toFixed(2)).toString(), f.group[0].position[0]+90, f.group[0].position[1]+90);}
}
function showInterface(){
  if(key=='c') {
    noFill()
    stroke(0,255,0, 75)
    strokeWeight(15)
    circle(mouseX, mouseY,350)
    noStroke()
    fill(0,255,0, 90)
    textSize(32)
    text('Cyanobacteria', mouseX-100, mouseY)}
  else if(key=='x') {
    noFill()
    stroke(0,255,0, 75)
    strokeWeight(15)
    circle(mouseX, mouseY,250)
    noStroke()
    fill(0,255,0, 90)
    textSize(32)
    text('School of Fish', mouseX-100, mouseY)}
  else{
    if (mouseIsPressed){
      noFill()
      stroke(0,255,255, 95)
      let aux = (2/3)*frameCount%60
      strokeWeight(3 - (aux/20))
      circle(mouseX, mouseY, aux)  
      noStroke()
    }  
  }
}
function mouseClicked(){
    if(key=='x'){
      FishPopulation.push(new SchoolOfFish(mouseX, mouseY , 10, getColor()))
      key = 'z'}
    if(key=='c'){
      CyanobacteriaPopulation.push(new Cyanobacteria(mouseX, mouseY, 60))
      key = 'z'}
}
function getColor(){
    return ([color(18, 255, 142), color(18, 166, 77), color(42, 255, 32),  color(113, 218, 18),color(195, 255, 18), color(255, 76, 0), color(255, 96, 85), color(255, 0, 0), color(255, 65, 50), color(255, 50, 36), color(
255, 15, 127), color(255, 28, 153), color(255, 43, 181), color(255, 59, 203), color(255, 140, 224),][Math.floor(Math.random()*15)])
}