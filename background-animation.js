class boid {
    constructor(
        initialPosition,
        p5ref,
        initialCanvasWidth,
        initialCanvasHeight
    ) {
        this.initialPosition = initialPosition;
        this.sketch = p5ref;
        this.size = Math.floor(Math.floor(Math.random() * 7));
        this.driftForce = new p5.Vector(this.getRandomArbitrary(-1, 1), this.getRandomArbitrary(-1, 1));
        this.acceleration = this.driftForce;
        this.velocity = new p5.Vector();
        this.position = new p5.Vector(initialPosition.x, initialPosition.y);
        this.forces = [];
        this.canvasWidth = initialCanvasWidth;
        this.canvasHeight = initialCanvasHeight;
        this.maxforce = 0.05;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(1);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.checkEdges();
        this.checkMouse();
    }

    draw() {
        this.sketch.ellipse(this.position.x, this.position.y, this.size, this.size);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    updateEdges(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    checkEdges() {
        if (this.position.x > this.canvasWidth) {
            this.position.x = 0;
        }

        if (this.position.y > this.canvasHeight) {
            this.position.y = 0;
        }

        if (this.position.y < 0) {
            this.position.y = this.canvasHeight;
        }

        if (this.position.x < 0) {
            this.position.x = this.canvasWidth;
        }
    }

    checkMouse() {
        let mouseVector = new p5.Vector(this.sketch.mouseX, this.sketch.mouseY);
        let distanceVector = p5.Vector.sub(mouseVector, this.position);
        let distanceScalar = distanceVector.mag();
        if (distanceScalar < 300) {
            this.buildSteeringForce(mouseVector, distanceVector);
        }
    }

    buildSteeringForce(mouseVector, distanceVector) {
        let desired = distanceVector.copy().mult(-1);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
    }
}

let p5Wrapper = function( sketch ) {
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let boids = [];

    sketch.setup = function() {
        if (window.innerWidth < 736) {
            sketch.createCanvas(canvasWidth, window.innerHeight);
        } else {
            sketch.createCanvas(canvasWidth, window.innerHeight);
        }
        for (var i = 0; i < 100; i++) {
            boids.push(new boid(new p5.Vector(Math.floor(Math.random() * canvasWidth-1), Math.floor(Math.random() * 799)), sketch, canvasWidth, window.innerHeight));
        }
    };

    sketch.draw = function() {
        sketch.clear();
        sketch.fill(255, 255, 255, 50);
        sketch.noStroke(0);
        boids.forEach(boid => {
            boid.update();
            boid.draw();
        });
    };

    sketch.windowResized = function() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        if(window.innerWidth <= 736) {
            sketch.resizeCanvas(canvasWidth, 400);
            boids.forEach(boid => {
                boid.updateEdges(canvasWidth, 400);
            });
        } else {
            sketch.resizeCanvas(canvasWidth, canvasHeight);
            boids.forEach(boid => {
                boid.updateEdges(canvasWidth, canvasHeight);
            });
        }
    };
};
