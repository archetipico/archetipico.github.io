/* Particle */
function Particle() {
    const posX = random(width);
    const posY = random(height);

    this.pos = createVector(posX, posY);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.maxspeed = round(random(1, 2));
    this.prevPos = this.pos.copy();
    this.rgb = [];
    this.age = 0;
    this.death = round(random(1000, 3000));
    this.strokeWeight = 0;
    this.uniqueValue = posX + posY + Date.now();

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.updatePrev = function() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    this.edges = function() {
        if (this.pos.x > width) {
            this.pos.x = -5;
            this.updatePrev();
        }

        if (this.pos.x < 0) {
            this.pos.x = width + 5;
            this.updatePrev();
        }

        if (this.pos.y > height) {
            this.pos.y = -5;
            this.updatePrev();
        }

        if (this.pos.y < 0) {
            this.pos.y = height + 5;
            this.updatePrev();
        }
    }

    this.follow = function( vectors ) {
        const x = floor(this.pos.x / scl);
        const y = floor(this.pos.y / scl);
        const index = x + y * cols
        const force = vectors[index];
        this.applyForce(force);
    }

    this.getAge = function() {
        return this.age;
    }

    this.getDeath = function() {
        return this.death;
    }

    this.getUniqueValue = function() {
        return this.uniqueValue;
    }

    this.incrementAge = function() {
        this.age++;
    }

    this.setColor = function() {
        this.rgb = [253, 162, 162];
    }

    this.setStrokeWeight = function(w) {
        this.strokeWeight = round(w);
    }

    this.show = function() {
        stroke(this.rgb[0], this.rgb[1], this.rgb[2], 5);
        strokeWeight(this.strokeWeight);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
        this.updatePrev();
    }

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
}

/* Flow Field */
let cols;
let rows;
let flowfield;
const inc = 0.1;
const scl = 10;
const particles = [];

function setup() {
    const cvn = createCanvas(windowWidth, windowHeight);
    cvn.position( 0, 0 );
    cvn.style('position', 'fixed');
    cvn.style('z-index', '-1');

    pixelDensity(1);
    noiseDetail(1);

    cols = floor(width / scl);
    rows = floor(height / scl);
    flowfield = new Array(cols * rows);

    for (let i = 0; i < 50; i++) {
        let p = new Particle();
        p.setStrokeWeight(random(3, 5));
        particles.push(p);
    }

    animate();
}

function animate() {
    updateFlowField();
    updateParticles();
    requestAnimationFrame(animate.bind(this));
}

function updateFlowField() {
    let xoff = 0;
    const twoPiTimes1Point5 = TWO_PI * 1.5;
    const mag = 0.5;

    for (let x = 0; x < rows; x++) {
        let yoff = 0;
        const xTimesCols = x * cols;

        for (let y = 0; y < cols; y++) {
            const index = xTimesCols + y;
            const n = noise(xoff, yoff) * twoPiTimes1Point5;
            flowfield[index] = p5.Vector.fromAngle(n).setMag(mag);
            yoff += inc;
        }

        xoff += inc;
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.incrementAge();
        if (p.getAge() >= p.getDeath()) {
            particles.splice(i, 1);
        } else {
            p.setColor();
            p.follow(flowfield);
            p.update();
            p.edges();
            p.show();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
