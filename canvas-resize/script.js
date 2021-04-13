let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let c = canvas.getContext('2d');


// c.fillStyle = 'rgba(255,0,0,0.5)';
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = 'rgba(0, 0, 255, 0.5)';
// c.fillRect(205, 100, 100, 100);
// c.fillStyle = 'rgba(0, 255, 0, 0.5)';
// c.fillRect(205, 205, 100, 100);
// c.fillStyle = 'rgba(255, 0, 255, 0.5)';
// c.fillRect(0, 0, 50, 50);

// c.beginPath();
// c.moveTo(50, 300);
// c.lineTo(305, 100);
// c.lineTo(500, 500);
// c.strokeStyle = "red";
// c.stroke();



// for (let i = 0; i < 100; i++) {
//     c.beginPath();
//     r = Math.random() * 200;
//     g = Math.random() * 200;
//     b = Math.random() * 200;
//     c.arc(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 30, 0, Math.PI * 2, false);
//     c.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
//     c.stroke();
// }





// function Circle(x, y, dx, dy, radius, color) {
//     this.x = x;
//     this.y = y;
//     this.dx = dx;
//     this.dy = dy;
//     this.radius = radius;
//     this.color = color;

//     this.draw = function () {

//         c.beginPath()
//         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//         c.strokeStyle = this.color;
//         c.stroke();
//     };

//     this.update = function () {

//         if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
//             this.dx = -this.dx;
//         }

//         if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
//             this.dy = -this.dy;
//         }

//         this.x += this.dx;
//         this.y += this.dy;
//         this.draw();
//     };
// }


let mouse = {
    x: undefined,
    y: undefined
};

let maxRadius = 40;
let minRadius = Math.random() * 9 + 1;

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});


addEventListener('touchmove', (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class Circle {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
        this.minRadius = radius
    }


    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    };


    update() {

        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;


        if (mouse.x - this.x < 50 && mouse.x - this.x > -50
            && mouse.y - this.y < 50 && mouse.y - this.y > -50
            && this.radius < maxRadius) {
            this.radius += 1;
        } else if (this.radius > this.minRadius) {
            this.radius -= 1;
        }



        this.draw();
    };
};
let circleArray = [];
let colors = [
    '#264653',
    '#2a9d8f',
    '#e9c46a',
    '#f4a261',
    '#e76f51',
]

function init() {
    circleArray = [];
    for (let i = 0; i < 1000; i++) {
        let radius = Math.random() * 9 + 1;
        let x = Math.random() * (innerWidth - radius * 2) + radius;
        let y = Math.random() * (innerHeight - radius * 2) + radius;
        let dx = (Math.random() - 0.5);
        let dy = (Math.random() - 0.5);
        let r = Math.random() * 200;
        let g = Math.random() * 200;
        let b = Math.random() * 200;
        let color = colors[Math.floor(Math.random() * 5)];

        circleArray.push(new Circle(x, y, dx, dy, radius, color));
    }
}

init();






function Square(x, y, dx, dy, width, height, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.height = height;
    this.width = width;
    this.color = color;

    this.draw = function () {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    this.update = function () {
        if (this.x + this.width > innerWidth || this.x - this.width < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.height > innerHeight || this.y - this.height < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}


let squareArray = [];

for (let i = 0; i < 200; i++) {
    let width = 100;
    let height = 100;
    let x = Math.random() * (innerWidth - width * 2);
    let y = Math.random() * (innerHeight - height * 2);
    let dx = (Math.random() - 0.5);
    let dy = (Math.random() - 0.5);
    let r = Math.random() * 200;
    let g = Math.random() * 200;
    let b = Math.random() * 200;
    let color = `rgba(${r}, ${g}, ${b}, 0.5)`;
    squareArray.push(new Square(x, y, dx, dy, width, height, color));
}

function animSquare() {
    requestAnimationFrame(animSquare);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < squareArray.length; i++) {
        squareArray[i].update();
    }
}





function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }

}




animate();
