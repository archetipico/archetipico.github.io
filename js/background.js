var cols,
    rows,
    flowfield,
    inc = 0.1,
    scl = 10,
    particles = [];

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

    for (var i = 0; i < 50; i++) {
        particles[i] = new Particle();
        particles[i].setStrokeWeight(random(3, 5));
    }
}

function draw() {
    var x = 0,
        xoff = 0,
        y = 0,
        yoff = 0,
        index = 0,
        n = 0;

    for (x = 0; x < rows; x++) {
        yoff = 0;
        for (y = 0; y < cols; y++) {
            index = x * cols + y;
            n = noise(xoff, yoff) * TWO_PI * 1.5;
            var v = p5.Vector.fromAngle(n);
            v.setMag(0.5);
            flowfield[index] = v;
            yoff += inc;
        }
        xoff += inc;
    }

    for (var i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.incrementAge();
        if (p.getAge() >= p.getDeath()) {
            particles = particles.filter(t => {
                return !(t.getUniqueValue() === p.getUniqueValue());
            });
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
