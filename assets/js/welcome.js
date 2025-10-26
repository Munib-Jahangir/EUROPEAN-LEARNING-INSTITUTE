// welcome.js - JavaScript for the welcome page

// Create particles for the welcome scene
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random size
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation duration
        const duration = Math.random() * 8 + 4;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Show loading progress
function updateLoadingProgress() {
    const loadingProgress = document.getElementById('loadingProgress');
    if (loadingProgress) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width++;
                loadingProgress.style.width = `${width}%`;
            }
        }, 60); // 6 seconds total for 100%
    }
}

// Hide welcome scene after 6 seconds
function hideWelcomeScene() {
    updateLoadingProgress();
    
    setTimeout(() => {
        const welcomeScene = document.getElementById('welcomeScene');
        if (welcomeScene) {
            welcomeScene.style.opacity = '0';
            
            setTimeout(() => {
                welcomeScene.style.display = 'none';
                const mainContent = document.getElementById('mainContent');
                if (mainContent) {
                    mainContent.classList.add('visible');
                }
                
                const coursesIntro = document.getElementById('coursesIntro');
                if (coursesIntro) {
                    coursesIntro.classList.add('visible');
                }
                
                const coursesContainer = document.getElementById('coursesContainer');
                if (coursesContainer) {
                    coursesContainer.classList.add('visible');
                }
                
                // Make course cards visible with staggered animation
                const courseCards = document.querySelectorAll('.course-card');
                courseCards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.05}s`;
                    // Force reflow to restart animation
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = `cardAppear 0.6s forwards ${index * 0.05}s`;
                    }, 10);
                });
                
                // Start smooth scrolling after cards appear
                setTimeout(() => {
                    startScrolling();
                }, 1500);
                
                // Redirect to index.html after 8 seconds of showcasing courses
                setTimeout(() => {
                    redirectToIndex();
                }, 8000);
            }, 1200);
        }
    }, 6000); // 6 seconds for welcome scene
}

// Function to scroll through courses smoothly
function startScrolling() {
    const container = document.querySelector('.courses-container');
    if (container) {
        let scrollPosition = 0;
        let startTime = null;
        const duration = 6000; // 6 seconds for scrolling
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        // Hide scrollbar but keep scrolling functionality
        container.style.scrollbarWidth = 'none';
        container.style.msOverflowStyle = 'none';
        container.style.paddingRight = '0';
        
        // Hide Webkit scrollbar
        const style = document.createElement('style');
        style.textContent = `
            .courses-container::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        function scrollStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth scrolling with easing
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            // Calculate scroll position with easing
            scrollPosition = easeInOutCubic * maxScroll;
            container.scrollTop = scrollPosition;
            
            // Continue animation until duration is reached
            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            } else {
                // Ensure we reach the bottom
                container.scrollTop = maxScroll;
            }
        }
        
        // Start the scrolling animation
        requestAnimationFrame(scrollStep);
    }
}

// Function to redirect to index.html with animation
function redirectToIndex() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.transition = 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(-30px) scale(0.98)';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    }
}

// Initialize header functionality
function initHeader() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('mainHeader');
        if (header && window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else if (header) {
            header.classList.remove('header-scrolled');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Simple scroll for browsers that don't support GSAP
                if (typeof gsap !== 'undefined') {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: target, offsetY: 70 },
                        ease: 'power2.inOut'
                    });
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    hideWelcomeScene();
    initHeader();
    initSmoothScrolling();
});