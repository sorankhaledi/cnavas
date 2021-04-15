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
let gravity = 1;


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
        this.y += gravity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}

let bullets;
let cannon;
let range;

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
})




function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = `rgba(0, 0, 0, .2)`;
    c.fillRect(0, 0, innerWidth, innerHeight);

    cannon.update();

    if(isMouseDown) {
        add++;
        if(add % 5 === 0) {
            let x = Math.cos(cannon.angle) * cannon.width;
            let y = Math.sin(cannon.angle) * cannon.width;
        
            x = x + canvas.width / 2;
            y = y + canvas.height;
        
            const velocity = {
                x: Math.cos(cannon.angle) * 10,
                y: Math.sin(cannon.angle) * 10
            }
            bullets.push(new Bullet(x, y, 9, "blue", velocity));
        }
    }

    bullets.forEach((bullet, i) => {
        if (Math.hypot(canvas.width / 2 - bullet.x, canvas.height - bullet.y) < range) {
            bullet.update();
        } else {
            bullets.splice(i, 1);
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

    isMouseDown = false;
    add = 0;

    if(innerWidth <= 600) {
        range = 200;
    } else if(innerWidth > 600 && innerWidth < 960) {
        range = 400;
    } else {
        range = canvas.height / 2;
    }
}
init();
animate();