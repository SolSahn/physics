let canvas = document.getElementById("abc");
let ctx = canvas.getContext("2d");

canvas.style.background = "#222";

const GRAVITY = {x: 0, y: 0.3}; // strength/direction of gravity
const BALL_COUNT = 50; // number of balls
const MOUSE_STRENGTH = 20; // lower = stronger

class Ball {
    constructor(position, velocity, mass, color) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = {x: 0, y: 0};
        this.mass = mass;
        this.radius = mass/4;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
    }
    addForce(force) {
        this.acceleration.x += force.x/this.mass; // F = ma
        this.acceleration.y += force.y/this.mass;
    }
    update() {
        this.addForce({x: GRAVITY.x * this.mass, y: GRAVITY.y * this.mass}); // gravity affects objects equally
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.acceleration = {x: 0, y: 0};
        if (this.position.x + this.radius >= canvas.width) {
            this.position.x = canvas.width - this.radius;
            this.velocity.x *= -1;
        }
        if (this.position.x - this.radius <= 0) {
            this.position.x = this.radius;
            this.velocity.x *= -1;
        }
        if (this.position.y + this.radius >= canvas.height) {
            this.position.y = canvas.height - this.radius;
            this.velocity.y *= -1;
        }
        if (this.position.y - this.radius <= 0) {
            this.position.y = this.radius;
            this.velocity.y *= -1;
        }
        this.draw();
    }
}

function randomPosition() {
    return {x: (Math.random() * (canvas.width - 50) + 50), y: (Math.random() * (canvas.height - 50) + 50)};
}
function randomVelocity() {
    return {x: (Math.random() * 10 - 5), y: (-Math.random() * 5)}
}
const balls = [];
for (let i = 0; i < BALL_COUNT; i++) {
    balls.push(new Ball(randomPosition(), randomVelocity(), Math.random() * 30 + 30, "white"));
}

let mousePos = {x: canvas.width/2, y: canvas.height/2};
canvas.addEventListener("mousemove", (event) => {mousePos = {x: event.clientX, y: event.clientY}})
let mouseDown = false;
canvas.addEventListener("mousedown", function() {mouseDown = true});
canvas.addEventListener("mouseup", function() {mouseDown = false});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mouseDown) {
        balls.forEach(ball => { // attract balls to mouse when down
            ball.addForce({x: (mousePos.x - ball.position.x)/MOUSE_STRENGTH, y: (mousePos.y - ball.position.y)/MOUSE_STRENGTH});
        });
    }
    balls.forEach(ball => ball.update());
    window.requestAnimationFrame(animate);
}
animate();