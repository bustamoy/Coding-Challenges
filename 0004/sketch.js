new p5();

class Drop {
  constructor(x, y, speed) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, speed);
    this.size = speed / 16;
  }

  draw(){
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y - 2 * this.vel.mag());
    ellipse(this.pos.x, this.pos.y, 0.8 * this.size, 1.5 * this.size);
  }

  update() {
    this.pos.add(this.vel);
  }
}

const
  WIDTH = 600,
  HEIGHT = 600,
  MAX_DROPS = 150,
  DROP_SPEED = 32;

let drops;


function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(30);
  drops = new Array(MAX_DROPS).fill().map(x => new Drop(WIDTH * random(), -WIDTH * random(), DROP_SPEED + 5 * randomGaussian()));
}

function draw() {
  background(50);
  stroke(200, 0, 200, 50);
  strokeWeight(1);
  fill(200, 0, 200, 100);
  for (let d of drops) {
    d.draw();
    d.update();
  }
  old_drops = drops.filter(x => x.pos.y - x.vel.mag() > HEIGHT);
  for (let d of old_drops) {
    d.pos.y -= HEIGHT;
    d.pos.x = WIDTH * random();
  }
}