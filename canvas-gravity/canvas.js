const canvas = document.querySelector('canvas');

canvas.height = innerHeight;
canvas.width = innerWidth;



const c = canvas.getContext('2d');



const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

let gravity = 1;
let friction = 0.833;

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.dx = dx;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    if(this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy * friction;
    } else {
      this.dy += gravity;
    }
    if (this.x + this.radius + this.dx > canvas.width || 
        this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if(this.y + this.radius + this.dy < canvas.height) {
      this.x += this.dx;
    }
    this.y += this.dy;
    this.draw();
  }
}



// // Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
})

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
})

addEventListener("click", () => {
  init();
})


// // Implementation
let balls = [];
let ball;
function init() {
  balls = [];
  for (let i = 0; i < 700; i++) {
    let radius = randomIntFromRange(10, 14);
    let x = randomIntFromRange(radius, innerWidth - radius);
    let y = randomIntFromRange(0, innerHeight - radius);
    let color = randomColor(colors);
    let dx = randomIntFromRange(-2, 2);
    let dy = randomIntFromRange(-2, 2);

    balls.push(new Ball(x, y, dx, dy, radius, color));
  }

  // ball = new Ball(canvas.width / 2, canvas.height / 2, 2, 30, 'red');
}



// // Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
   ball.update()
  })
}

init();
animate();




function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

// function distance(x1, y1, x2, y2) {
//   const xDist = x2 - x1
//   const yDist = y2 - y1

//   return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
// }
