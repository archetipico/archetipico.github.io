var cols, rows;
var inc = 0.1;
var flowfield;
var scl = 10;

var particles = [];

function setup() {
    var cvn = createCanvas(windowWidth, windowHeight);
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
        particles[i].setStrokeWeight(random(1, 5));
    }
}

function draw() {
    var xoff = 0;
    for (var x = 0; x < rows; x++) {
        var yoff = 0;
        for (var y = 0; y < cols; y++) {
            var index = x * cols + y;
            var n = noise(xoff, yoff) * TWO_PI * 1.5;
            var v = p5.Vector.fromAngle( n);
            v.setMag(0.5);
            flowfield[index] = v;
            yoff += inc;
        }
        xoff += inc;
    }

    for (var i = 0; i < particles.length; i++ ) {
        let p = particles[i];
        p.incrementAge();
        if (p.getAge() >= random(1000, 3000)) {
            p = new Particle();
        }

        p.setColor();
        p.follow(flowfield);
        p.update();
        p.edges();
        p.show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}