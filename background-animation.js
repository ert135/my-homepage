const airResistance = -0.0099;
const minSize = 6;
const maxSize = 16;

const initialDriftForce = 4000000;
const boidAmount = 100;

class boid {
    constructor(
        initialPosition,
        p5ref,
        initialCanvasWidth,
        initialCanvasHeight,
        size
    ) {
        this.initialPosition = initialPosition;
        this.sketch = p5ref;
        if(size){
            this.size = size;
        } else {
            this.size = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize); 
        }
        this.driftForce = new p5.Vector(this.getRandomArbitrary(-initialDriftForce, initialDriftForce), this.getRandomArbitrary(-initialDriftForce, -initialDriftForce));
        this.acceleration = this.driftForce;
        this.velocity = new p5.Vector();
        this.position = new p5.Vector(initialPosition.x, initialPosition.y);
        this.forces = [];
        this.canvasWidth = initialCanvasWidth;
        this.canvasHeight = initialCanvasHeight;
        this.maxforce = 0.10;
    }

    update() {
        this.acceleration.sub(this.size * -0.002);
        this.velocity.add(this.acceleration);
        this.velocity.limit(5);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.checkEdges();
        this.checkMouse();
        this.applyResistance();
    }

    draw() {

        let color;
        if (this.size <= 7) {
            color = this.sketch.color(255, 255, 255, 30);
        }

        if (this.size <= 6) {
           color = this.sketch.color(255, 255, 255, 20);
        }

        if (this.size > 7) {
            color = this.sketch.color(255, 255, 255, 40);
        }

        if (this.size > 10) {
            color = this.sketch.color(255, 255, 255, 100);
        }
        this.sketch.fill(color);
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
        if (distanceScalar < 100) {
            this.buildSteeringForce(mouseVector, distanceVector);
        }
    }

    buildSteeringForce(mouseVector, distanceVector) {
        const desired = distanceVector.copy().mult(-1);
        const steer = p5.Vector.sub(desired, this.velocity);

        let modifiedSteeringForce;
        if (this.size <= 10) {
            modifiedSteeringForce = steer.div(1000);
        }

        if (this.size <= 7) {
            modifiedSteeringForce = steer.div(700);
        }

        if (this.size > 10) {
            modifiedSteeringForce = steer.div(60);
        }

        this.applyForce(modifiedSteeringForce);
    }

    applyResistance() {
        const resistanceForce = this.velocity.copy().mult(airResistance);
        this.applyForce(resistanceForce);
    }
}

let p5Wrapper = function( sketch ) {
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let boids = [];

    sketch.setup = function() {
        sketch.pixelDensity(1); 
        if (window.innerWidth < 736) {
            sketch.createCanvas(canvasWidth, window.innerHeight);
        } else {
            sketch.createCanvas(canvasWidth, window.innerHeight);
        }
        for (var i = 0; i < boidAmount; i++) {
            boids.push(new boid(new p5.Vector(Math.floor(Math.random() * canvasWidth-1), Math.floor(Math.random() * 799)), sketch, canvasWidth, window.innerHeight));
            boids.push(new boid(new p5.Vector(Math.floor(Math.random() * canvasWidth-1), Math.floor(Math.random() * 799)), sketch, canvasWidth, window.innerHeight, 5));
        }
    };

    sketch.draw = function() {
        sketch.clear();
        sketch.fill(255, 255, 255, 50);
        sketch.noStroke(0);
        boids.forEach(boid => {
            boid.update(boids);
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
