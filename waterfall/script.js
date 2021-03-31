const canvas = document.querySelector("canvas");

canvas.height = innerHeight;
canvas.width = innerWidth;

const c = canvas.getContext("2d");


let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
}

let isMouseDown = false;

class Rect{
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angle= 0;

    }

    draw() {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.beginPath();
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 3;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.fillRect(0, -this.height / 2, this.width, height);
        c.closePath();
        c.restore();
    }
    update() {
        desireAngle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        this.angle = desireAngle;
        this.draw();
    }
}


// let cannon = new Rect(canvas.width / 2, canvas.height , 20, 10, 'white');
// cannon.update();


let desireAngle = 0;

function Initialize () {

}

