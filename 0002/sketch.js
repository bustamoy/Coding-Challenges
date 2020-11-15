class Menger {
  constructor(size, x, y, z, order = 1) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    if (this.children) {
      this.children.map(c => c.display());
    } else {
      box(this.size);
    }
    pop();
  }

  split(level) {
    if (this.order === level && this.children) {
      console.log('delete');
      delete this.children;
    } else if (this.order < level) {
      if (!this.children) {
        this.children = [];
        const off = (this.size / 3);
        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            for (let k of [-1, 0, 1]) {
              this.children.push(new Menger(off, j * off, i * off, k * off, this.order + 1));
            }
          }
        }
        this.children = this.children.filter((x, i) => !([22, 16, 14, 13, 12, 10, 4].includes(i)));
      }
      this.children.map(c => c.split(level));
    }
  }
}

const SIZE = 400;
let m;
let depth = 1;

function setup() {
  createCanvas(2 * SIZE, 2 * SIZE, WEBGL);
  m = new Menger(SIZE, 0, 0, 0);
  normalMaterial();
}

function draw() {
  background(50);
  orbitControl(5, 5, 5);
  rotateY(frameCount * 0.01);
  stroke(0);
  strokeWeight(1);
  m.display();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    depth++;
  } else if (keyCode === DOWN_ARROW) {
    depth--;
  }
  depth = constrain(depth, 1, 5);
  console.log(`depth:${depth}`);
  m.split(depth);
}