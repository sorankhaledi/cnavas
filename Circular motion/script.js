const canvas = document.querySelector('canvas');

canvas.height = innerHeight;
canvas.width = innerWidth;



const c = canvas.getContext('2d');



const colors = ['#f4a261', '#e9c46a', '#2a9d8f', '#264653'];


let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};


let min = 40;
let max = 70;

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.05;
        this.mult = randomIntFromRange(min, max);
        this.lastMouse = { x: x, y: y };
    }

    update() {
        const lastPoint = { x: this.x, y: this.y }

        //move points
        this.radians += this.velocity;


        //Drag effect
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05; 
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05; 

        //circular motion
        this.x = this.lastMouse.x + Math.cos(this.radians) * this.mult;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.mult;
        this.draw(lastPoint);
    }

    draw(lastPoint) {
        c.beginPath();
        c.strokeStyle = this.color;
        c.lineWidth = this.radius;
        c.moveTo(lastPoint.x, lastPoint.y);
        c.lineTo(this.x, this.y);
        c.stroke();
        c.closePath();
    }
}


// // Event Listeners
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;


});


addEventListener('touchmove', (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});


addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});

// addEventListener("click", () => {
//     init();
// })


// // Implementation
let balls;
function init() {
    if(innerWidth <= 600) {
        min = 30;
        max = 40;
    } else if(innerWidth > 600 && innerWidth < 960) {
        min = 50;
        max = 80;
    } else if(innerWidth >= 960 && innerWidth < 1264) {
        min = 60;
        max = 100;
    } else {
        min = 70;
        max = 150;
    }


    balls = [];
    for (let i = 0; i < 100; i++) {
        const radius = (Math.random() * 10) + 1;
        const color = randomColor(colors);
        balls.push(new Ball(canvas.width / 2, canvas.height / 2, radius, color));

    }

}



// // Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'rgba(255, 255, 255, 0.05)';
    c.fillRect(0, 0, canvas.width, canvas.height);

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
