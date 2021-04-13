const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const gravity = 0.005;
const friction = 0.99;


class Particle{
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.opacity = 1;

    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }
    update() {
        this.draw();

        //to slow them down by time
        this.velocity.x *= friction; 
        this.velocity.y *= friction; 

        //make them go down 
        this.velocity.y += gravity;

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        //to fade them out as they go down
        this.opacity -= 0.005;
    }
}




let particles;
particles = [];


addEventListener("click", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;


    const max = 400;
    const radian = (Math.PI * 2) / max;
    const power = 5;

    for (let i = 0; i < max; i++) {

        particles.push(new Particle(mouse.x, mouse.y, 3, `hsl(${Math.random() * 360}, 50%, 50%)`, {
            x: Math.cos(radian * i) * Math.random() * power,
            y: Math.sin(radian * i) * Math.random() * power
        }));
    }
    
});


// addEventListener("resize", Initialize);




function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.05)';
    c.fillRect(0, 0, canvas.width, canvas.height);


    particles.forEach((particle, i) => {
        if(particle.opacity > 0) {
            particle.update();
        } else {
            particles.splice(i,1);
        }
    })

}



animate();
