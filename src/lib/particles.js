/**
 * Particles.js - A lightweight particle animation library
 * Author: Your Name
 * License: MIT
 */

class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = Math.random() * 3 - 1.5; // Random speed in x direction
        this.speedY = Math.random() * 3 - 1.5; // Random speed in y direction
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off the walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}

class ParticleSystem {
    constructor(canvasId, particleCount) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = particleCount;

        this.init();
        this.animate();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            const radius = Math.random() * 5 + 2; // Random radius between 2 and 7
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const color = this.getRandomColor();
            this.particles.push(new Particle(x, y, radius, color));
        }
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    animate() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.context);
        });
        requestAnimationFrame(() => this.animate());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.init(); // Reinitialize particles on resize
    }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem('particlesCanvas', 100);
});
