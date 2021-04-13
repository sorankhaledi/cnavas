const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const center = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

let angle = 0;

//event listeners
addEventListener("click", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener("mousemove", (event) => {
    
    mouse.x = event.clientX - center.x;
    mouse.y = event.clientY - center.y;

    console.log(mouse);

    angle = Math.atan2(mouse.y, mouse.x);
});


addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});



class Particle{
    constructor(x, y, radius, color, distance) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.distance = distance;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();

        this.x = center.x + this.distance * Math.cos(angle);
        this.y = center.x + this.distance * Math.sin(angle);
    }
}

let particles;
function init() {
    particles = [];

    const particlesCount = 300;
    const hueIncrement = 360 / particlesCount;

    for (let i = 0; i < particlesCount; i++) {
        const x = center.x + i * Math.cos(Math.PI);
        const y = center.y + i * Math.sin(-Math.PI);

        
        particles.push(new Particle(x, y, 5, `hsl(${hueIncrement * i}, 50%, 50%)`, i));
        
    }
}


function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);


    particles.forEach(particle => {
        particle.update();
    })

}


init();
animate();
