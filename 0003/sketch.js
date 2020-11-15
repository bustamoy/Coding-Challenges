new p5();

const
  WIDTH = 600,
  HEIGHT = 600,
  DIRECTIONS = [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW],
  SIZE = 8,
  SPEED = 2,
  START_LENGTH = 360,
  GROW_RATE = 10;

class Snake {
  constructor(size, speed, length, x, y) {
    this.size = size;
    this.speed = speed;
    this.length = length;
    this.dir = DIRECTIONS[~~(random() * SIZE) % 4];
    this.points = [createVector(x, y), createVector(x, y)];
  }

  display() {
    strokeWeight(this.size);
    let pathlength = this.length;
    for (let i = 0; i < this.points.length - 1; i++) {
      let seglength = this.points[i].dist(this.points[i + 1]);
      if (pathlength >= seglength) {
        line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
        pathlength -= seglength;
      } else {
        let nub = p5.Vector.sub(this.points[i + 1], this.points[i]);
        nub.setMag(Math.min(seglength, pathlength));
        let tail = p5.Vector.add(this.points[i], nub);
        line(this.points[i].x, this.points[i].y, tail.x, tail.y);
        this.points.splice(i+1);
        this.points.push(tail);
        break;
      }
    }
    // strokeWeight(1);
    // for (let p of this.points) {
    //   text(`(${p.x.toFixed(0)},${p.y.toFixed(0)})`, p.x, p.y);
    // }
  }

  update() {
    this.points[0][this.dir % 2 ? 'x' : 'y'] += this.dir <= UP_ARROW ? -this.speed : this.speed;
  }

  changeDirection(d) {
    if (Math.abs(keyCode - this.dir) % 2 != 0) {
      this.points.unshift(createVector(this.points[0].x, this.points[0].y));
      this.dir = DIRECTIONS[keyCode - LEFT_ARROW];
    }
  }

  died(width, height) {
    return snake.points[0].x < 0 || snake.points[0].x > width || snake.points[0].y < 0 || snake.points[0].y > height || this.checkCollision(this.points[0])
  }

  checkFood(food) {
    return p5.Vector.dist(this.points[0], food.pos) < this.size;
  }

  checkCollision(test) {
    for (let i = 2; i < this.points.length - 1; i++) {
      let a = this.points[i];
      let b = this.points[i+1];
      let ab = p5.Vector.sub(b, a);
      let ae = p5.Vector.sub(test, a);
      let be = p5.Vector.sub(test, b);
      let dist;
      if (p5.Vector.dot(ab, be) > 0) {
        dist = p5.Vector.dist(test, b.copy());
      } else if (p5.Vector.dot(ab, ae) < 0) {
        dist = p5.Vector.dist(test, a.copy());
      } else {
        dist = Math.abs(ab.x * ae.y - ab.y * ae.x) / ((ab.x**2 + ab.y**2)**0.5);
      }
      if (dist < this.size) {
        return true;
      }
      let num = Math.abs((b.y - a.y)*test.x - (b.x - a.x)*test.y + b.x*a.y - b.y*a.x);
      let denom = ((b.y - a.y)**2 + (b.x - a.x)**2)**0.5
      if (num/denom < this.speed) {
        return true;
      }

      // let p1 = this.points[i];
      // let p2 = this.points[i+1];
      // let p3 = this.points[0];
      // let p4 = this.points[1];

      // let xnum = (p2.x*p1.y - p1.x*p2.y) * (p4.x - p3.x) - (p4.x*p3.y - p3.x*p4.y)*(p2.x-p1.x);
      // let xden = (p2.x-p1.x)*(p4.y-p3.y) - (p4.x-p3.x)*(p2.y-p1.y);
      // let x = xnum / xden;
      // let ynum = (p2.x*p1.y-p1.x*p2.y)*(p4.y-p3.y)+(p4.x*p3.y+p3.x*p4.y)*(p2.y-p1.y);
      // let yden = (p2.x-p1.x)*(p4.y-p3.y)-(p4.x-p3.x)*(p2.y-p1.y);
      // let y = ynum / yden;
      // let t = createVector(x, y);

      // if ((!isNaN(x) && !isNaN(y) &&Number.isFinite(x) && Number.isFinite(y)) && (((p1.x>p2.x && p1.x >= x && x >= p2.x) || (p2.x>p1.x && p2.x >= x && x >= p1.x)) && ((p1.y>p2.y && p1.y >= y && y >= p2.y) || (p2.y>p1.y && p2.y >= y && y >= p1.y)))) {
      //   console.log(`(${x},${y})`);
      //   push();
      //   stroke(0, 0, 255);
      //   ellipse(x, y, 4, 4);
      //   stroke(255, 0, 0);
      //   line(p1.x, p1.y, p2.x, p2.y);
      //   pop();
      //   return true;
      // }

      // let start = this.points[i];
      // let end = this.points[i+1];

      // let line_vec = p5.Vector.sub(end, start);
      // let pnt_vec = p5.Vector.sub(test, start);

      // let line_len = line_vec.mag();
      // let line_unitvec = line_vec.copy().normalize();
      // let pnt_vec_scaled = pnt_vec.copy().mult(1.0/line_len);

      // let t = p5.Vector.dot(line_unitvec, pnt_vec_scaled);

      // if (t < 0.0) {
      //     t = 0.0;
      // } else if (t > 1.0) {
      //     t = 1.0;
      // }
      // let nearest = line_vec.copy().mult(t);
      // let dist = p5.Vector.dist(nearest, pnt_vec);

      // nearest = p5.Vector.add(nearest, start);

      // if (dist < this.size+this.speed) {
        // return true;
      // }
    }
    return false;
  }

  grow(growth) {
    this.length *= 1 + growth/100;
  }
}

class Food {
  constructor(size, x, y) {
    this.size = size;
    this.pos = createVector(x, y);
    this.color = color(255, 0, 0);
  }

  static genFood() {
    return new Food(SIZE / 2, random() * (WIDTH - SIZE), random() * HEIGHT);
  }
  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}


let snake, food, paused = false;

const genSnake = () => new Snake(SIZE, SPEED, START_LENGTH, random() * WIDTH / 2 + WIDTH / 6, random() * HEIGHT / 2 + HEIGHT / 6);


function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(30);
  // textSize(14);
  snake = genSnake();
  food = Food.genFood();
}

function draw() {
  if (!paused) {
    background(50);

    noStroke();
    food.display();

    stroke(255);
    snake.display();

    snake.update();
    if (snake.checkFood(food)) {
      snake.grow(GROW_RATE);
      do {
        food = Food.genFood();
        console.log("new food");
      } while (snake.checkCollision(food.pos))
    }
    if (snake.died(WIDTH, HEIGHT)) {
      console.log('DIED');
      snake = genSnake();
    }
  }
}

function handlePause() {
  if (paused) {
    if (isLooping()) {
      noLoop();
    }
    push();
    noStroke();
    fill(0,0, 0, 200);
    rect(0, 0, WIDTH, HEIGHT);
    fill(255);
    rectMode(CENTER);
    rect(WIDTH / 2 - WIDTH / 32, HEIGHT/2, WIDTH / 32, height / 8);
    rect(WIDTH / 2 + WIDTH / 32, HEIGHT/2, WIDTH / 32, height / 8);
    pop();
  } else {
    if (!isLooping()) {
      loop();
    }
  }
}

function keyPressed() {
  if (DIRECTIONS.includes(keyCode)) {
    snake.changeDirection(keyCode);
  } else if (key === ' ') {
    paused = !paused;
    handlePause(paused);
  }
  return false;
}