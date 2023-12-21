class Player {
  constructor(x, y, h, w, speed) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.speed = speed;
  }
  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  move(keys) {
    switch (true) {
      case keys["w"]:
        if (this.y > 0) {
          this.y -= this.speed;
          console.log("new y position", this.x);
        }
        break;
      case keys["s"]:
        if (this.y < canvas.height - this.h) {
          this.y += this.speed;
          console.log("new y position", this.y);
        }
        break;
    }
  }
}
class Enemy {
  constructor(x, y, h, w, speed) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.speed = speed;
  }
  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  move(ballYPosition) {
    let center = (this.y + this.h/2);
    if(center < ballYPosition){
      this.y+=this.speed;
    } else if (center > ballYPosition){
      this.y-=this.speed;
    }
    this.y = Math.round(this.y);
  }
}

class Ball {
  constructor(x, y, radius) {
    this.centerX = x;
    this.centerY = y;
    this.radius = radius;
    this.leftwardsMovement = 10;
    this.upwardsMovement = 0;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  detectCollisionRect(rect) {
    return (
      rect.x <= this.centerX &&
      rect.x + rect.w >= this.centerX &&
      rect.y < this.centerY &&
      rect.y + rect.h > this.centerY
    );
  }
  detectCollisionScreen(canvas, scorePlayer, scoreEnemy) {
    if (this.centerX < 0) {
      this.resetCoordinates(canvas);
      scoreEnemy.value++;
    } else if (this.centerX > canvas.width) {
      this.resetCoordinates(canvas);
      scorePlayer.value++;
    }
    if (this.centerY < 0 || this.centerY > canvas.height) {
      this.upwardsMovement = -this.upwardsMovement;
    }
  }
  resetCoordinates(canvas) {
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.leftwardsMovement = -this.leftwardsMovement;
    this.upwardsMovement = 0;
  }

  move(player, canvas, enemy, scorePlayer, scoreEnemy) {
    if (this.detectCollisionRect(player) || this.detectCollisionRect(enemy)) {
      this.leftwardsMovement = -this.leftwardsMovement;
      this.upwardsMovement = Math.random() * 20 - 10;
      console.log("collision");
    }

    this.detectCollisionScreen(canvas,scorePlayer, scoreEnemy);

    this.centerX -= this.leftwardsMovement;
    this.centerY -= this.upwardsMovement;
  }
}

class Text {
  constructor(x, y, font, color, str) {
    this.x = x;
    this.y = y;
    this.font = font;
    this.color = color;
    this.str = str;
  }
  draw(ctx) {
    ctx.font = this.font;
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 3;
    ctx.fillStyle = this.color;
    ctx.fillText(this.str, this.x, this.y);
    ctx.restore();
  }
}

class InterfaceElement {
  constructor(x, y, font, color, str, value) {
    this.text = new Text(x, y, font, color, "");
    this.name = str;
    this.value = value;
  }
  draw(ctx) {
    this.text.str = this.name + this.value;
    this.text.draw(ctx);
  }
}

let keys = {};
function onKeyDown(event) {
  keys[event.key] = true;
}
function onKeyUp(event) {
  keys[event.key] = false;
}
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.98;
canvas.height = window.innerHeight * 0.97;
ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
ctx.shadowBlur = 5;

console.log(canvas.width);
console.log(canvas.width / 2);
let player = new Player(canvas.width / 8, canvas.height / 3, 250, 50, 10);
let enemy = new Enemy(canvas.width / 8 * 7, canvas.height / 3, 250, 50, 10);
let title = new Text(
  canvas.width / 2.3,
  canvas.height / 10,
  "100px Signika Negative",
  "white",
  "PONG"
);
let scorePlayer = new InterfaceElement(
  canvas.width/3,
  75,
  "72px Signika Negative",
  "black",
  "",
  0
);
let scoreEnemy = new InterfaceElement(
  canvas.width/3 * 2,
  75,
  "72px Signika Negative",
  "black",
  "",
  0
);
let ball = new Ball(canvas.width / 2, canvas.height / 2, 20);
function update() {
  player.move(keys);
  enemy.move(ball.centerY);
  ball.move(player, canvas, enemy, scorePlayer, scoreEnemy);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  enemy.draw(ctx);
  ball.draw(ctx);
  title.draw(ctx);
  scorePlayer.draw(ctx);
  scoreEnemy.draw(ctx);
  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
