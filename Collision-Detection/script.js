const canvas = document.querySelector('canvas');

canvas.height = innerHeight;
canvas.width = innerWidth;



const c = canvas.getContext('2d');



const colors = ['#001524', '#15616d', '#ff7d00', '#78290f'];

let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};


class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: randomIntFromRange(-2.5, 2.5),
            y: randomIntFromRange(-2.5, 2.5)
        }
        this.radius = radius;
        this.color = color;
        this.mass = 1;
        this.opacity = 0;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }

    update(balls) {
        this.draw();


        for (let i = 0; i < balls.length; i++) {
            if(this === balls[i]) continue;

            if(distance(this.x, this.y, balls[i].x, balls[i].y) - this.radius * 2 < 0) {
                resolveCollision(this, balls[i]);
            }
        }

        if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width ) {
            this.velocity.x = -this.velocity.x;
        }

        if(this.y - this.radius <= 0 || this.y + this.radius >= canvas.height ) {
            this.velocity.y = -this.velocity.y;
        }

        if (distance(mouse.x, mouse.y, this.x, this.y) < 120 && this.opacity < 0.2) {
            this.opacity += 0.02;
        } else if(this.opacity > 0 ) {
            this.opacity -= 0.02;

            this.opacity = Math.max(0, this.opacity);
        }


        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
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


// // Implementation
let balls = [];
let maxBalls;
function init() {

    if(innerWidth <= 600) {
        maxBalls = 40;
    } else if(innerWidth > 600 && innerWidth < 960) {
        maxBalls = 80;
    } else if(innerWidth >= 960 && innerWidth < 1264) {
        maxBalls = 110;
    } else {
        maxBalls = 200;
    }


    balls = [];
    for (let i = 0; i < maxBalls; i++) {
        let radius = 15;
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(radius, canvas.height - radius);
        let color = randomColor(colors);

        if(i !== 0) {
            for (let j = 0; j < balls.length; j++) {
                if(distance(x, y, balls[j].x, balls[j].y) - radius * 2 <= 0) {
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);
                    j = -1;
                }
                
            }
        }
        balls.push(new Ball(x, y, radius, color));
    }

}

// // Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.update(balls);
    });
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