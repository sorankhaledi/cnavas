const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreSpan = document.querySelector(".point");
const btn = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const modalScore = document.querySelector(".modal-score");


canvas.width = innerWidth;
canvas.height = innerHeight;

const center = {
    x: canvas.width / 2,
    y: canvas.height / 2
}


// ====================== classes ======================

// =============== player class ===============
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}
// =============== end player class ===============


// =============== projectile class ===============
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
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
// =============== end projectile class ===============


// =============== enemy class ===============
class Enemy {
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
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
// =============== end enemy class ===============


// =============== particle class ===============
const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015;
    }
}
// =============== end particle class ===============

// ====================== end classes ======================






// charachters
let player;
let projectiles;
let enemies;
let particles;
let score;
let gameIsRunning;
// end charachters


// event listeners
// shoting enemies
window.addEventListener("click", (event) => {
    if(gameIsRunning) {
        let angle = Math.atan2(event.clientY - center.y, event.clientX - center.x);
    
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        projectiles.push(new Projectile(center.x, center.y, 5, "white", velocity));
    }
});

// game start
btn.addEventListener("click", () => {
    Init();
    animate();
    spawnEnemies();
    modal.style.display = "none";
    setTimeout(() => {
        gameIsRunning = true;
    }, 10);
});
// end event listeners



// functions
function Init() {
    player = new Player(center.x, center.y, 20, 'white');
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    gameIsRunning = false;
    scoreSpan.innerHTML = score;
    modalScore.innerHTML = score;
}

let enemyInterval;
function spawnEnemies() {
    enemyInterval = setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10;
        let x;
        let y;

        if (Math.random() <= 0.49) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            x = Math.random() * canvas.width;
        }


        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        let angle = Math.atan2(center.y - y, center.x - x);

        let randomNum = Math.random() * (3 - 2) + 2; 
        const velocity = {
            x: Math.cos(angle) * randomNum,
            y: Math.sin(angle) * randomNum
        }
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}


let animation__ID;
function animate() {
    animation__ID = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, innerWidth, innerHeight);
    player.draw();


    // explotion effect
    particles.forEach((particle, i) => {
        if(particle.alpha > 0) {
            particle.update();
        } else {
            setTimeout(() => {
                particles.splice(i, 1);
            }, 1);
        }
    })


    projectiles.forEach((projectile, i) => {
        projectile.update();

        // remove projectiles that go out of screen
        if (projectile.x - projectile.radius < 0 ||
            projectile.x + projectile.radius > canvas.width ||
            projectile.y + projectile.radius > canvas.height ||
            projectile.y - projectile.radius < 0) {
            setTimeout(() => {
                projectiles.splice(i, 1);
            }, 0);
        }
    });
    enemies.forEach((enemy, eIndex) => {
        enemy.update();

        const playerAndEnemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        // check if we lose
        if (playerAndEnemyDist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animation__ID);
            modalScore.innerHTML = score;
            modal.style.display = 'flex';
            gameIsRunning = false;
            clearInterval(enemyInterval);
        }

        // check if we hit enemies by projectiles
        projectiles.forEach((projectile, pIndex) => {
            const projectileAndEnemyDist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            // paricle hited enemy
            if (projectileAndEnemyDist - enemy.radius - projectile.radius < 1) {

                


                // create particles for explotion effect
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            projectile.x, 
                            projectile.y, 
                            Math.random() * 2,
                            enemy.color, 
                            { 
                                x: (Math.random() - 0.5) * (Math.random() * 5),
                                y: (Math.random() - 0.5) * (Math.random() * 5)
                            }
                        )
                    );
                    
                }
                
                // shrink enemies
                if (enemy.radius - 10 > 10) {
                    
                    // increase our score
                    score += 100;
                    scoreSpan.innerHTML = score;



                    gsap.to(enemy, { radius: enemy.radius - 10});
                    setTimeout(() => {
                        projectiles.splice(pIndex, 1);
                    }, 1);
                } else {

                    // increase our score
                    score += 250;
                    scoreSpan.innerHTML = score;



                    setTimeout(() => {
                        enemies.splice(eIndex, 1);
                        projectiles.splice(pIndex, 1);
                    }, 1);
                }
            }
        })
    })
}
// end functions

