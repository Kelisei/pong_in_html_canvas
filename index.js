class Player {
  constructor(x, y, h, w, speed) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.speed = speed;
  }
  draw(ctx) {
    //Body
    ctx.fillRect(this.x, this.y, this.h, this.w);
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
        if (this.y < canvas.height - this.h * 5) {
          this.y += this.speed;
          console.log("new y position", this.y);
        }
        break;
    }
  }
}

class Ball {
  constructor(x, y, radius) {
    this.centerX = x;
    this.centerY = y;
    this.radius = radius;
    this.leftwardsMovement = 0;
    this.upwardsMovement = 0;
  }
  getBoundingBox() {
    return {
      px: this.centerX - this.radius,
      py: this.centerY + this.radius,
      px2: this.centerX + this.radius,
      py2: this.centerY - this.radius,
    };
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  detectCollisionRect(rect) {
    let boundingBox = this.getBoundingBox();
    console.log(boundingBox);
    let rx1 = rect.x;
    let ry1 = rect.y;
    let rx2 = rect.x + rect.width;
    let ry2 = rect.y - rect.height;
    return (
      rx1 < boundingBox.px2 &&
      rx2 > boundingBox.px &&
      ry1 > boundingBox.py2 &&
      ry2 < boundingBox.py
    );
  }
  detectCollisionScreen(canvas) {
    if (this.centerX < 0) {
      this.centerX = canvas.width / 2;
    } else if (this.centerX > canvas.width) {
      this.centerX = canvas.width / 2;
    }
  }
  move(player, canvas, enemy) {
    if (this.detectCollisionRect(player)) {
      this.leftwardsMovement = -this.leftwardsMovement;
      this.upwardsMovement = Math.random() + 1;
    }
    this.detectCollisionScreen(canvas);

    this.centerX -= this.leftwardsMovement;
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
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)"; // Shadow color (black with 50% opacity)
    ctx.shadowBlur = 3; // Shadow blur radius
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

//Event listener setup
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
ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color (black with 50% opacity)
ctx.shadowBlur = 5; // Shadow blur radius

console.log(canvas.width);
console.log(canvas.width / 2);
let player = new Player(canvas.width / 8, canvas.height / 3, 50, 250, 10);
let title = new Text(
  canvas.width / 2.3,
  canvas.height / 10,
  "100px Signika Negative",
  "white",
  "PONG"
);
let score = new InterfaceElement(
  10,
  50,
  "50px Signika Negative",
  "black",
  "Score: ",
  0
);
let ball = new Ball(canvas.width / 2, canvas.height / 2, 20);
console.log(ball.centerX, ball.centerY);
function update() {
  player.move(keys);
  ball.move(player, canvas, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  ball.draw(ctx);
  title.draw(ctx);
  score.draw(ctx);
  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
