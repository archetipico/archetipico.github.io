function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.maxspeed = 2;
    this.prevPos = this.pos.copy();
    this.rgb = [];
    this.age = 0;
    this.strokeWeight = 0;

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
        var x = floor(this.pos.x / scl);
        var y = floor(this.pos.y / scl);
        var index = x + y * cols
        var force = vectors[index];
        this.applyForce(force);
    }

    this.getAge = function() {
        return this.age;
    }

    this.incrementAge = function() {
        this.age++;
    }

    this.setColor = function() {
        this.rgb = [253, 162, 162];
    }

    this.setStrokeWeight = function(w) {
        this.strokeWeight = w;
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