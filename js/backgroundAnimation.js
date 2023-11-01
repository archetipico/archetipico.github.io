/* Particle */
function Particle() {
    const posX = random(width);
    const posY = random(height);

    this.pos = createVector(posX, posY);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.maxspeed = round(random(1, 3));
    this.prevPos = this.pos.copy();
    this.age = 0;
    this.death = round(random(1000, 3000));
    this.strokeWeight = round(random(3, 5));
    this.uniqueValue = posX + posY + Date.now();

    stroke(253, 162, 162, 5);
    strokeWeight(this.strokeWeight);

    this.applyForce = (force) => {
        this.acc.add(force);
    }

    this.updatePrev = () =>  {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    this.edges = () =>  {
        this.pos.x = Math.max(-10, Math.min(this.pos.x, width + 10));
        this.pos.y = Math.max(-10, Math.min(this.pos.y, height + 10));
        this.updatePrev();
    }

    this.follow = (vectors) => {
        const x = floor(this.pos.x / scl);
        const y = floor(this.pos.y / scl);
        const index = x + y * cols
        const force = vectors[index];
        this.applyForce(force);
    }

    this.getUniqueValue = () => {
        return this.uniqueValue;
    }

    this.isDead = () => {
        return this.age >= this.death;
    }

    this.show = () => {
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
        this.updatePrev();
    }

    this.update = () => {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.age++;
    }
}

/* Flow Field */
const inc = 0.1;
const scl = 10;

let cols;
let rows;
let flowfield;
let particles = [];

function initializer() {
    cols = floor(width / scl);
    rows = floor(height / scl);
    flowfield = new Array(cols * rows);

    populate(rows + cols);
}

function setup() {
    const W = windowWidth + 10;
    const H = windowHeight + 10;
    const cvn = createCanvas(W, H);
    cvn.position(0, 0);
    cvn.style('position', 'fixed');
    cvn.style('z-index', '-1');

    pixelDensity(1);
    noiseDetail(1);

    initializer();
    animate();
}

function animate() {
    updateFlowField();
    updateParticles();
    requestAnimationFrame(animate.bind(this));
}

function populate(size) {
    particles = [];

    for (let i = 0; i < size; i++) {
        particles.push(new Particle());
    }
}

function updateFlowField() {
    let xoff = 0;
    const fastPI = TWO_PI * 1.5;
    const mag = 0.5;

    for (let x = 0; x < rows; x++) {
        let yoff = 0;
        const xCols = x * cols;

        for (let y = 0; y < cols; y++) {
            const index = xCols + y;
            const n = noise(xoff, yoff) * fastPI;
            flowfield[index] = p5.Vector.fromAngle(n).setMag(mag);
            yoff += inc;
        }

        xoff += inc;
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        if (p.isDead()) {
            particles[i] = particles[particles.length - 1];
            particles.pop();
        } else {
            p.follow(flowfield);
            p.update();
            p.edges();
            p.show();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth + 10, windowHeight + 10);
    initializer();
}
