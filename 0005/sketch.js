new p5();

class Ship {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.width = w;
    this.height = h;
    this.color = color(100, 0, 100);
  }
  display() {
    noStroke();
    fill(this.color);
    triangle(this.pos.x, this.pos.y, this.pos.x - this.width / 2, this.pos.y + this.height, this.pos.x + this.width / 2, this.pos.y + this.height);
  }
  steer(dir) {
    this.dir = dir;
  }
  update() {
    this.pos.add(this.dir);
  }
}

class Bullet {
  constructor(x, y, speed) {
    this.pos = createVector(x, y);
    this.speed = speed;
  }
  display() {
    noFill();
    stroke(255);
    strokeWeight(4);
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.speed);
  }
  update() {
    this.pos.y -= this.speed;
  }
  hits(x, y, w, h) {
    return (x <= this.pos.x && this.pos.x <= x + w && y <= this.pos.y && this.pos.y <= y + h);
  }
}

class Enemy {
  constructor(x, y, w, h, color) {
    this.pos = createVector(x, y);
    this.width = w;
    this.height = h;
    this.color = color;
  }

  display() {
    noStroke();
    fill(this.color);
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }
}

const
  WIDTH = 600,
  HEIGHT = 600,
  MARGIN = 20,
  ROWS = 6,
  COLS = 8,
  ENEMY_WIDTH = WIDTH / 24,
  ENEMY_HEIGHT = HEIGHT / 24,
  SHIP_SPEED = 12,
  BULLET_SPEED = 10;

let colors;
let enemies;
let packpos;
let packdir;
let bullets;
let ship;

function genEnemies() {
  for (let i = 0; i < ROWS; i++) {
    enemies[i] = new Array(COLS);
    let rowcolor = random(colors);
    for (let j = 0; j < COLS; j++) {
      enemies[i][j] = new Enemy(j * (ENEMY_WIDTH + MARGIN), ENEMY_HEIGHT / 2 + i * (ENEMY_HEIGHT + MARGIN), ENEMY_WIDTH, ENEMY_HEIGHT, rowcolor);
    }
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(30);
  colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 0, 255), color(0, 255, 255)];
  packdir = createVector(ENEMY_WIDTH / 4, 0);
  packpos = createVector(MARGIN, MARGIN);
  enemies = new Array(ROWS);
  bullets = [];
  genEnemies();
  ship = new Ship(WIDTH / 2, HEIGHT - MARGIN - ENEMY_HEIGHT / 2, ENEMY_HEIGHT, ENEMY_HEIGHT);
}

function draw() {
  background(50);

  push();
  translate(packpos.x, packpos.y);
  enemies.map(row => row.map(enemy => enemy && enemy.display()));
  pop();
  stroke(255);
  bullets.map(b => b.display());
  if (frameCount % 8 == 0) {
    bullets.push(new Bullet(ship.pos.x, ship.pos.y, BULLET_SPEED));
    bullets = bullets.filter(b => b.pos.y > -HEIGHT);
  }
  ship.display();

  updates();
}

function updates() {
  bullets.map(b => b.update());
  ship.update();
  if (frameCount % 10 == 0) {
    packpos.add(packdir);
    if (packpos.x < MARGIN || packpos.x + COLS * (ENEMY_WIDTH + MARGIN) > WIDTH) {
      packdir.mult(-1, 1);
      packpos.add(packdir);
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let r = 0; r < enemies.length; r++) {
      let row = enemies[r];
      for (let c = 0; c < row.length; c++) {
        let e = enemies[r][c];
        if (e && bullets[i].hits(e.pos.x + packpos.x, e.pos.y + packpos.y, e.width, e.height)) {
          bullets.splice(i, 1);
          delete enemies[r][c];
        }
      }
    }
  }
  if (enemies.flat().filter(x=>!!x).length === 0) {
    genEnemies();
  }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    ship.steer(createVector(-SHIP_SPEED, 0));
  } else if (keyCode == RIGHT_ARROW) {
    ship.steer(createVector(SHIP_SPEED, 0));
  }
}

function keyReleased() {
  ship.steer(createVector(0, 0));
}