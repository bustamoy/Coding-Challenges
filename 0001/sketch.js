const STAR_SPEED = 1.02;
class Star {
  constructor(w, h) {
    this.pos = createVector(w * randomGaussian(), h * randomGaussian());
  }

  display(vanishing) {
    stroke(255);
    strokeWeight(0.1);
    let h = p5.Vector.add(this.pos, p5.Vector.sub(vanishing, this.pos).limit(HALF_WIDTH / 3));
    line(this.pos.x, this.pos.y, h.x, h.y);

    const size = map(vanishing.dist(this.pos), 0, HALF_WIDTH * 2, 1, 8);
    noStroke();
    fill(map(this.pos.sub(vanishing).mag(), 0, MAX_DIST, 25, 150));
    ellipse(this.pos.x, this.pos.y, size, size);
  }

  update(vanishing) {
    this.pos.setMag(this.pos.mag() * STAR_SPEED);
    let d = this.pos.sub(vanishing);
  }
}

const STAR_SCALE = 50;
const HALF_WIDTH = 300;
const HALF_HEIGHT = 300;
const NUM_STARS = HALF_WIDTH + HALF_HEIGHT;
const MAX_DIST = (HALF_WIDTH ** 2 + HALF_HEIGHT ** 2) ** 0.5;

let stars = [];
let vanish;

function setup() {
  createCanvas(HALF_WIDTH * 2, HALF_HEIGHT * 2);
  vanish = createVector(0, 0);
}

function draw() {
  background(25);
  translate(HALF_WIDTH, HALF_HEIGHT);
  ellipseMode(CENTER);
  fill(100);
  stars.forEach(s => {
    s.display(vanish);
    s.update(vanish);
  });
  stars = stars.filter(s => dist(s.pos.x, s.pos.y, 0, 0) < MAX_DIST);
  stars = stars.concat([new Star(1, 1)]).slice(0, NUM_STARS);
}