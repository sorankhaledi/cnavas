const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;


let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

let isMouseDown = false;
let add = 0;
let gravity = 0.01;
let friction = 0.99


class Rect {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angle = 0;
    }

    update() {
        this.angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        this.draw();
    }

    draw() {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.beginPath();
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 2;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.fillRect(0, -this.height / 2, this.width, this.height);
        c.closePath();
        c.restore();
    }
}

class Projectile {
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
        c.shadowColor = this.color;
        c.shadowBlur = 10;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
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
        this.opacity -= 0.009;
    }
}

class Bullet {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.07;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}

let cannon;
let bullets;
let range;
let projectiles;

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("resize", () => {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    init();
});





addEventListener("mousedown", () => {
    isMouseDown = true;
});

addEventListener("mouseup", () => {
    isMouseDown = false;
});

addEventListener("touchstart", () => {
    isMouseDown = true;
});

addEventListener("touchend", () => {
    isMouseDown = false;
});




function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = `rgba(18, 18, 18, 0.2)`;
    c.fillRect(0, 0, innerWidth, innerHeight);

    cannon.update();

    // shoting bullets
    if(isMouseDown) {
        add++;
        if(add % 5 === 0) {
            let x = Math.cos(cannon.angle) * cannon.width;
            let y = Math.sin(cannon.angle) * cannon.width;
        
            x = x + canvas.width / 2;
            y = y + canvas.height;
        
            const velocity = {
                x: Math.cos(cannon.angle) * 8,
                y: Math.sin(cannon.angle) * 8
            }
            bullets.push(new Bullet(x, y, 9, "white", velocity));
        }
    }

    bullets.forEach((bullet, i) => {
        if (Math.hypot(canvas.width / 2 - bullet.x, canvas.height - bullet.y) < range) {
            bullet.update();
        } else {
            let max = Math.random() * (50 - 30) + 30;
            let power = (Math.random() * (12 - 8) + 8);
            for(let i=0;i< max; i++) {
                projectiles.push(new Projectile(bullet.x, bullet.y, 3, `hsl(${Math.random() * 360}, 50%, 50%)`, {
                    x: (Math.random() - 0.5) * power, 
                    y: (Math.random() - 0.5) * power
                }));
            }
            bullets.splice(i, 1);
        }
    });


    projectiles.forEach((projectile, i) => {
        if(projectile.opacity > 0) {
            projectile.update();
        } else {
            projectiles.splice(i, 1);
        }
    })


}

function init() {
    cannon = new Rect(
        canvas.width / 2,
        canvas.height,
        40,
        20,
        "white"
    );
    bullets = [];
    projectiles = [];

    isMouseDown = false;
    add = 0;

    if(innerWidth <= 600) {
        range = 200;
    } else if(innerWidth > 600 && innerWidth < 960) {
        range = 350;
    } else if(innerWidth >= 960 && innerWidth < 1264) {
        range = 550;
    } else {
        range = canvas.height / 2;
    }
}
init();
animate();