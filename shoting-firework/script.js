const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

let center = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

let mouse = {
    x: center.x,
    y: center.y
}


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
        this.range = (canvas.width / 3) + (canvas.width / 6);
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
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

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("resize", () => {
    canvas.height = innerHeight;
    canvas.width = innerWidth;

    Init();
});





addEventListener("click", (event) => {


    let x = Math.cos(cannon.angle) * cannon.width;
    let y = Math.sin(cannon.angle) * cannon.width;

    x = x + center.x;
    y = y + canvas.height;

    const velocity = {
        x: Math.cos(cannon.angle) * 10,
        y: Math.sin(cannon.angle) * 10
    }
    bullets.push(new Bullet(x, y, 9, "blue", velocity));
    console.log(bullets);

});




function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = `rgba(0, 0, 0, .2)`;
    c.fillRect(0, 0, innerWidth, innerHeight);

    cannon.update();

    bullets.forEach((bullet, i) => {
        if (Math.hypot(center.x - bullet.x, canvas.height - bullet.y) < bullet.range) {
            bullet.update();
        } else {
            bullets.splice(i, 1);
        }
    })


}

function init() {
    cannon = new Rect(
        center.x,
        canvas.height,
        40,
        20,
        "white"
    );
    bullets = [];

}

init();
animate();