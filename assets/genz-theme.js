// Gen Z Theme JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Add animation classes to elements when they come into view
    const animateElements = document.querySelectorAll('.product-card, .category-card, .instagram-item, .section-header');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(el => {
            el.classList.add('animate-in');
        });
    }
    
    // Video autoplay for product videos
    const productVideos = document.querySelectorAll('.product-video');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        }, {
            threshold: 0.5
        });
        
        productVideos.forEach(video => {
            videoObserver.observe(video);
        });
    }
    
    // Stories carousel navigation for mobile
    const storiesCarousel = document.querySelector('.stories-carousel');
    const prevBtn = document.querySelector('.stories-prev');
    const nextBtn = document.querySelector('.stories-next');
    
    if (storiesCarousel && prevBtn && nextBtn) {
        const scrollAmount = 200;
        
        prevBtn.addEventListener('click', () => {
            storiesCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            storiesCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Update button states
        const updateButtonStates = () => {
            const isAtStart = storiesCarousel.scrollLeft <= 10;
            const isAtEnd = storiesCarousel.scrollLeft + storiesCarousel.clientWidth >= storiesCarousel.scrollWidth - 10;
            
            prevBtn.disabled = isAtStart;
            prevBtn.style.opacity = isAtStart ? '0.5' : '1';
            nextBtn.disabled = isAtEnd;
            nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        };
        
        storiesCarousel.addEventListener('scroll', updateButtonStates);
        window.addEventListener('resize', updateButtonStates);
        
        // Initial update
        updateButtonStates();
    }
    
    // Wishlist functionality
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    
    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            // Animation effect
            const heart = this.querySelector('svg');
            heart.style.transform = 'scale(1.3)';
            setTimeout(() => {
                heart.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // Format prices with currency
    const formatPrices = () => {
        const priceElements = document.querySelectorAll('.product-card-price, .video-product-price');
        
        priceElements.forEach(el => {
            const price = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
            if (!isNaN(price)) {
                el.textContent = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(price);
            }
        });
    };
    
    formatPrices();
    
    // Add view counts to videos (for demo purposes)
    const addViewCounts = () => {
        const viewCountElements = document.querySelectorAll('.video-views');
        
        viewCountElements.forEach(el => {
            const randomViews = Math.floor(Math.random() * 100) + 1;
            let viewText = randomViews + 'K Views';
            
            if (randomViews > 50) {
                viewText = randomViews + 'K Views 🔥';
            }
            
            el.textContent = viewText;
        });
    };
    
    addViewCounts();
});
