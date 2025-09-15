// Professional PowerPoint-style presentation JavaScript

class Presentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.progressFill = document.getElementById('progressFill');
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateSlideDisplay();
        this.updateProgressBar();
        this.updateNavButtons();
        
        // Event listeners with error handling
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Set total slides display
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
        
        console.log('Presentation initialized with', this.totalSlides, 'slides');
        console.log('Navigation buttons:', this.prevBtn, this.nextBtn);
    }
    
    nextSlide() {
        console.log('Next slide called, current:', this.currentSlide);
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        console.log('Previous slide called, current:', this.currentSlide);
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        console.log('Going to slide:', slideNumber);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        // Remove active class from all slides first
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Update current slide number
        this.currentSlide = slideNumber;
        
        // Add active class to new slide
        const newSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (newSlideElement) {
            newSlideElement.classList.add('active');
        }
        
        // Update UI elements
        this.updateSlideDisplay();
        this.updateProgressBar();
        this.updateNavButtons();
        
        // Announce slide change for accessibility
        this.announceSlideChange();
        
        console.log('Successfully navigated to slide', this.currentSlide);
    }
    
    updateSlideDisplay() {
        // Update slide counter
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
        }
    }
    
    updateProgressBar() {
        if (this.progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
            console.log('Progress updated to:', progress + '%');
        }
    }
    
    updateNavButtons() {
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
            if (this.currentSlide === 1) {
                this.prevBtn.textContent = 'Start';
            } else {
                this.prevBtn.textContent = '← Previous';
            }
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.textContent = 'End';
            } else {
                this.nextBtn.textContent = 'Next →';
            }
        }
    }
    
    handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowRight':
            case 'Space':
            case 'PageDown':
                event.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                event.preventDefault();
                this.goToSlide(1);
                break;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const presentationContainer = document.querySelector('.presentation-container');
        
        if (presentationContainer) {
            presentationContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            presentationContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                
                // Only process horizontal swipes
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        // Swipe right - go to previous slide
                        this.previousSlide();
                    } else {
                        // Swipe left - go to next slide
                        this.nextSlide();
                    }
                }
            }, { passive: true });
        }
    }
    
    announceSlideChange() {
        // Create or update screen reader announcement
        let announcement = document.getElementById('slide-announcement');
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'slide-announcement';
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            document.body.appendChild(announcement);
        }
        
        const slideTitle = document.querySelector(`[data-slide="${this.currentSlide}"] .slide-title, [data-slide="${this.currentSlide}"] .main-title, [data-slide="${this.currentSlide}"] .thank-you-title`)?.textContent || `Slide ${this.currentSlide}`;
        announcement.textContent = `${slideTitle}. Slide ${this.currentSlide} of ${this.totalSlides}`;
    }
    
    // Method to programmatically navigate to a specific slide (useful for extensions)
    navigateToSlide(slideNumber) {
        this.goToSlide(slideNumber);
    }
    
    // Method to get current slide information
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            isFirst: this.currentSlide === 1,
            isLast: this.currentSlide === this.totalSlides
        };
    }
    
    // Method to reset presentation to first slide
    reset() {
        this.goToSlide(1);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing presentation...');
    
    // Wait a bit to ensure all elements are rendered
    setTimeout(() => {
        // Initialize main presentation functionality
        window.presentation = new Presentation();
        
        // Manual button binding as backup
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.onclick = function(e) {
                e.preventDefault();
                if (window.presentation) {
                    window.presentation.previousSlide();
                }
                return false;
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = function(e) {
                e.preventDefault();
                if (window.presentation) {
                    window.presentation.nextSlide();
                }
                return false;
            };
        }
        
        console.log('Backup button handlers attached');
        
        // Add loading animation cleanup
        document.body.classList.add('loaded');
        
        // Console instructions for developers/presenters
        console.log('🎯 Cyber Security Presentation Controls:');
        console.log('→ Arrow Keys: Navigate slides');
        console.log('→ Space: Next slide');
        console.log('→ Home/End: First/Last slide');
        console.log('→ Escape: Return to first slide');
        console.log('→ Touch: Swipe left/right on mobile');
        
        // Expose presentation API for potential extensions
        window.presentationAPI = {
            nextSlide: () => window.presentation && window.presentation.nextSlide(),
            previousSlide: () => window.presentation && window.presentation.previousSlide(),
            goToSlide: (n) => window.presentation && window.presentation.navigateToSlide(n),
            getCurrentInfo: () => window.presentation && window.presentation.getCurrentSlideInfo(),
            reset: () => window.presentation && window.presentation.reset()
        };
        
    }, 100);
});

// Handle page visibility changes (for presentations)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh current slide when tab becomes visible
        if (window.presentation) {
            window.presentation.updateSlideDisplay();
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Ensure slide display remains consistent on resize
    if (window.presentation) {
        setTimeout(() => {
            window.presentation.updateSlideDisplay();
        }, 100);
    }
});

// Debug function to test navigation manually
window.debugNavigation = function() {
    console.log('Current presentation state:', window.presentation);
    console.log('Prev button:', document.getElementById('prevBtn'));
    console.log('Next button:', document.getElementById('nextBtn'));
    console.log('Current slide:', window.presentation ? window.presentation.currentSlide : 'N/A');
};