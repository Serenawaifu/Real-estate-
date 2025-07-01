/**
 * Smooth Scroll - A lightweight smooth scrolling library
 * Author: Your Name
 * License: MIT
 */

class SmoothScroll {
    constructor(options) {
        this.options = {
            duration: 600, // Default duration for the scroll
            easing: 'easeInOutQuad', // Default easing function
            ...options
        };
        this.init();
    }

    init() {
        // Attach click event listeners to all anchor links
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollTo(targetId);
            });
        });
    }

    scrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.options.duration, 1);
            const easingFunction = this.easing(progress);
            const scrollPosition = startPosition + distance * easingFunction;

            window.scrollTo(0, scrollPosition);

            if (timeElapsed < this.options.duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easing(t) {
        switch (this.options.easing) {
            case 'easeInQuad':
                return t * t;
            case 'easeOutQuad':
                return t * (2 - t);
            case 'easeInOutQuad':
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            case 'easeInCubic':
                return t * t * t;
            case 'easeOutCubic':
                return (--t) * t * t + 1;
            case 'easeInOutCubic':
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            default:
                return t; // Linear
        }
    }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
    const smoothScroll = new SmoothScroll({
        duration: 800, // Customize duration if needed
        easing: 'easeInOutQuad' // Customize easing function if needed
    });
});
