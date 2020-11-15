new p5();

class Cell {
  constructor(x, y, size, rate, color) {
    this.pos = createVector(x, y);
    this.size = size;
    this.rate = rate;
    this.color = color;
  }
  draw() {
    push();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    pop();
  }
  update() {
    if (random() <= this.rate) {
      let newsize = ~~((this.size ** 2 / 2) ** 0.5);
      let offset = p5.Vector.random2D().setMag(newsize);
      this.pos.add(offset);
      this.size = this.size / 2;
      cells.push(new Cell(this.pos.x - offset.x, this.pos.y - offset.y, newsize, this.rate, this.color));
    }
  }
}

const WIDTH = 600;
const HEIGHT = 600;
const SIZE = 32;
const MIN_SIZE = 8;
const MAX_CELLS = 200;
const RATE = 0.06;
let cells;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  cells = new Array(~~(MAX_CELLS)).fill().map(c=>new Cell(randomGaussian()*WIDTH, randomGaussian()*HEIGHT, random(SIZE) + SIZE, RATE, color(random(255), random(255), random(255))));
}

function draw() {
  background(50);
  noStroke();
  if (frameCount % 10 === 0 ) {
    cells.map(c => c.update());
    cells = cells.filter(c=>c.size >=MIN_SIZE).slice(0, MAX_CELLS);
  }
  cells.map(c => c.draw());
}

function mousePressed() {
  cells.map(c => c.update());
  cells = cells.filter(c=>c.size >=MIN_SIZE).slice(0, MAX_CELLS);
}