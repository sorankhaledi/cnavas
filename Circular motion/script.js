const canvas = document.querySelector('canvas');

canvas.height = innerHeight;
canvas.width = innerWidth;



const c = canvas.getContext('2d');



const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];


let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = 0;
        this.velocity = 0.05;
    }

    update() {
        this.radians += this.velocity;
        this.x = this.x + Math.cos(this.radians);
        this.y = this.y + Math.sin(this.radians);
        this.draw();
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
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
let balls;
function init() {
    balls = [];

    for (let i = 0; i < 1; i++) {
        balls.push(new Ball(canvas.width / 2, canvas.height / 2, 5, 'blue'));

    }

    console.log(balls);
}



// // Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.update();
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

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}
