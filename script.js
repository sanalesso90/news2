// Initialize Lenis smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Get scroll value
let scrollY = 0;
const navbar = document.querySelector('.navbar');
const logo = navbar.querySelector('.logo');

lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    scrollY = scroll;
    
    // Calculate the opacity based on scroll position
    const maxScroll = 200;
    const scrollProgress = Math.min(1, scrollY / maxScroll);
    
    // Apply the styles
    navbar.style.backgroundColor = `rgba(255, 255, 255, ${1 - (scrollProgress * 0.1)})`;
    logo.style.opacity = 1 - (scrollProgress * 0.2);
    
    if (scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Integrate Lenis with GSAP
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Update ScrollTrigger
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel();
    initParallaxEffect();
    initMobileNavigation();
    initNewsSection();
    initCinematicJourneysCarousel();
    initBreakingNewsTicker();
    initShowcaseScrollTrigger();
    updatePolitician(); // Initialize the first politician
});

function initHeroCarousel() {
    const carouselItems = document.querySelectorAll('.hero-carousel-item');
    let currentItem = 0;

    function nextItem() {
        carouselItems[currentItem].classList.remove('active');
        currentItem = (currentItem + 1) % carouselItems.length;
        carouselItems[currentItem].classList.add('active');
    }

    if (carouselItems.length > 0) {
        setInterval(nextItem, 3000);
    }
}

function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    lenis.on('scroll', () => {
        const scrollPosition = scrollY;
        const heroRect = heroSection.getBoundingClientRect();

        if (heroRect.bottom > 0) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
            heroTitle.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            heroSubtitle.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
    });
}

function initMobileNavigation() {
    const mobileNav = document.querySelector('#mobile-nav');
    const menu = document.querySelector('#menu');
    const menuToggle = document.querySelector('.nav__toggle');
    let isMenuOpen = false;

    menuToggle.addEventListener('click', e => {
        e.preventDefault();
        isMenuOpen = !isMenuOpen;
        menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
        menu.hidden = !isMenuOpen;
        mobileNav.classList.toggle('nav--open');
    });

    mobileNav.addEventListener('keydown', e => {
        if (!isMenuOpen || e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }
        const menuLinks = menu.querySelectorAll('.nav__link');
        if (e.keyCode === 9) {
            if (e.shiftKey) {
                if (document.activeElement === menuLinks[0]) {
                    menuToggle.focus();
                    e.preventDefault();
                }
            } else if (document.activeElement === menuToggle) {
                menuLinks[0].focus();
                e.preventDefault();
            }
        }
    });
}

function initNewsSection() {
    gsap.registerPlugin(ScrollTrigger);

    const newsSection = document.querySelector('.news-section');
    
    gsap.set(newsSection, { backgroundColor: '#000000' });

    gsap.to(newsSection, {
        backgroundColor: '#ffffff',
        scrollTrigger: {
            trigger: newsSection,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
            onEnter: () => gsap.to(newsSection, { color: '#000000', duration: 0.5 }),
            onLeaveBack: () => gsap.to(newsSection, { color: '#ffffff', duration: 0.5 })
        }
    });

    gsap.utils.toArray('.news-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

function initCinematicJourneysCarousel() {
    const carouselData = [
        {
            thumbnailSrc: './img/trump9.jpeg',
            videoSrc: './video/video1.mp4',
            title: 'Nature Scenes',
            description: 'Breathtaking landscapes and wildlife.'
        },
        {
            thumbnailSrc: './img/trump6.jpeg',
            videoSrc: './video/video2.mp4',
            title: 'Urban Life',
            description: 'Hustle and bustle of city living.'
        },
        {
            thumbnailSrc: './img/trump10.jpeg',
            videoSrc: './video/video3.mp4',
            title: 'Tech Marvels',
            description: 'Latest advancements in technology.'
        },
        {
            thumbnailSrc: './img/trump7.jpeg',
            videoSrc: './video/video4.mp4',
            title: 'Culinary Delights',
            description: 'Gourmet dishes from around the world.'
        },
        {
            thumbnailSrc: './img/trump8.jpeg',
            videoSrc: './video/video1.mp4',
            title: 'Sports Action',
            description: 'Thrilling moments in various sports.'
        }
    ];

    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const fullscreenVideo = document.querySelector('.fullscreen-video');
    const fullscreenVideoElement = fullscreenVideo.querySelector('video');
    const closeBtn = document.querySelector('.close-btn');

    let currentIndex = 0;

    function createCarouselItem(item) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        carouselItem.innerHTML = `
            <img src="${item.thumbnailSrc}" alt="${item.title}" class="carousel-item-thumbnail">
            <div class="play-button"></div>
            <div class="carousel-item-content">
                <h2 class="carousel-item-title">${item.title}</h2>
                <p class="carousel-item-description">${item.description}</p>
            </div>
        `;

        carouselItem.addEventListener('click', () => expandVideo(item.videoSrc));

        return carouselItem;
    }

    function populateCarousel() {
        carouselData.concat(carouselData).forEach((item) => {
            const carouselItem = createCarouselItem(item);
            carousel.appendChild(carouselItem);
        });
    }

    function moveCarousel(direction) {
        const itemWidth = carousel.querySelector('.carousel-item').offsetWidth + 20;
        const totalItems = carousel.children.length;
        
        if (direction === 'next') {
            currentIndex++;
            if (currentIndex >= totalItems / 2) {
                currentIndex = 0;
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(0)`;
                carousel.offsetHeight;
                carousel.style.transition = 'transform 0.5s ease';
            }
        } else {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = totalItems / 2 - 1;
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                carousel.offsetHeight;
                carousel.style.transition = 'transform 0.5s ease';
            }
        }
        
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    function expandVideo(videoSrc) {
        fullscreenVideoElement.src = videoSrc;
        fullscreenVideo.classList.add('active');
        fullscreenVideoElement.play();
    }

    function closeFullscreenVideo() {
        fullscreenVideo.classList.remove('active');
        setTimeout(() => {
            fullscreenVideoElement.pause();
            fullscreenVideoElement.src = '';
        }, 500);
    }

    prevBtn.addEventListener('click', () => moveCarousel('prev'));
    nextBtn.addEventListener('click', () => moveCarousel('next'));
    closeBtn.addEventListener('click', closeFullscreenVideo);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenVideo.classList.contains('active')) {
            closeFullscreenVideo();
        }
    });

    populateCarousel();

    gsap.from('.page-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.page-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.carousel-container', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        scrollTrigger: {
            trigger: '.carousel-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.utils.toArray('.carousel-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

function initBreakingNewsTicker() {
    const ticker = document.querySelector('.breaking-news-ticker');
    const tickerItems = ticker.querySelectorAll('li');

    // Ensure there's enough content to scroll
    const tickerWidth = ticker.offsetWidth;
    let totalWidth = 0;
    tickerItems.forEach(item => {
        totalWidth += item.offsetWidth;
    });

    if (totalWidth < tickerWidth) {
        const repeats = Math.ceil(tickerWidth / totalWidth);
        for (let i = 0; i < repeats; i++) {
            tickerItems.forEach(item => {
                ticker.appendChild(item.cloneNode(true));
            });
        }
    }

    // Add hover effects
    tickerItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            ticker.style.animationPlayState = 'paused';
        });
        item.addEventListener('mouseleave', () => {
            ticker.style.animationPlayState = 'running';
        });
    });

    // Add click events for news modal
    tickerItems.forEach(item => {
        item.addEventListener('click', () => {
            openNewsModal(item.textContent);
        });
    });

    addProgressBar();

    // Simulate news updates
    setInterval(updateNews, 10000);
}

function openNewsModal(content) {
    const modal = document.createElement('div');
    modal.classList.add('news-modal');
    modal.innerHTML = `
        <div class="news-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Breaking News</h2>
            <p>${content}</p>
            <div class="share-buttons">
                <button class="share-btn facebook">Share on Facebook</button>
                <button class="share-btn twitter">Share on Twitter</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => document.body.removeChild(modal);

    window.onclick = (event) => {
        if (event.target == modal) {
            document.body.removeChild(modal);
        }
    };

    const facebookBtn = modal.querySelector('.share-btn.facebook');
    const twitterBtn = modal.querySelector('.share-btn.twitter');

    facebookBtn.onclick = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    };

    twitterBtn.onclick = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    };
}

function addProgressBar() {
    const container = document.querySelector('.breaking-news-container');
    const progressBar = document.createElement('div');
    progressBar.classList.add('news-progress-bar');
    container.appendChild(progressBar);

    resetProgressBar();
}

function resetProgressBar() {
    const progressBar = document.querySelector('.news-progress-bar');
    progressBar.style.width = '0%';
    setTimeout(() => {
        progressBar.style.transition = 'width 10s linear';
        progressBar.style.width = '100%';
    }, 50);
}

function updateNews() {
    const ticker = document.querySelector('.breaking-news-ticker');
    const firstItem = ticker.querySelector('li');
    
    firstItem.style.transition = 'opacity 0.5s, transform 0.5s';
    firstItem.style.opacity = '0';
    firstItem.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        ticker.appendChild(firstItem);
        firstItem.style.transition = '';
        firstItem.style.opacity = '';
        firstItem.style.transform = '';
        resetProgressBar();
    }, 500);
}

// Politician showcase section
const politicians = [
    {
        name: "Donald Trump",
        role: "Senator for State X",
        imageUrl: "./img/PORTRAITTRUMP.jpeg"
    },
    {
        name: "Barack Obama",
        role: "Representative for District Y",
        imageUrl: "./img/hillary.jpeg"
    },
    {
        name: "Hillary Clinton",
        role: "Governor of State Z",
        imageUrl: "./img/barack.jpeg"
    },
    // Add more politicians as needed
];

let currentIndex = 0;

function updatePolitician() {
    const politician = politicians[currentIndex];
    const politicianCard = document.getElementById('politicianCard');
    const politicianImage = document.getElementById('politicianImage');
    const politicianName = document.getElementById('politicianName');
    const politicianRole = document.getElementById('politicianRole');

    // Create a timeline for the transition
    const tl = gsap.timeline();

    // Move current content to the left and fade out
    tl.to(politicianCard, { 
        x: '-100%', 
        opacity: 0, 
        duration: 0.5,
        onComplete: () => {
            // Update the content
            politicianImage.src = politician.imageUrl;
            politicianImage.alt = politician.name;
            politicianName.textContent = politician.name;
            politicianRole.textContent = politician.role;

            // Reset position for the new content
            gsap.set(politicianCard, { x: '100%' });
        }
    })
    // Bring in the new content from the right
    .to(politicianCard, { 
        x: '0%', 
        opacity: 1, 
        duration: 0.5,
        ease: "power2.out"
    });
}

function nextPolitician() {
    currentIndex = (currentIndex + 1) % politicians.length;
    updatePolitician();
}

// GSAP ScrollTrigger for showcase section
function initShowcaseScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger);

    const showcaseContainer = document.querySelector('.showcase-container');
    const contentWrapper = document.querySelector('.content-wrapper');
    const politicianCard = document.querySelector('.politician-card');
    

    // Create a timeline for the showcase section
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: showcaseContainer,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });

    tl.from(contentWrapper, {
        x: -100,
        opacity: 0,
        duration: 1
    })
    .from(politicianCard, {
        x: 100,
        opacity: 0,
        duration: 1
    }, "-=0.5")
    .from('.title', {
        y: 50,
        opacity: 0,
        duration: 0.5
    }, "-=0.5");

    // Enhanced parallax effect for the background image (bottom to top)
    gsap.fromTo('.background-image', 
        { yPercent: 0 },  // Starting position
        {
            yPercent: 10,  // Ending position (negative value for upward movement)
            ease: "none",
            scrollTrigger: {
                trigger: showcaseContainer,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        }
    );
}

// Add event listener for the next button
document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', nextPolitician);
    }
});

// Utility function to check if an element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle lazy loading of images
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        if (isInViewport(img)) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
}

// Add event listener for scroll to handle lazy loading
window.addEventListener('scroll', lazyLoadImages);
window.addEventListener('resize', lazyLoadImages);

// Call lazyLoadImages on page load
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Function to handle smooth scrolling for anchor links
function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const targetPosition = targetElement.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Add event listeners for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll(this.getAttribute('href'), 1000);
    });
});

// Initialize any third-party libraries or widgets here
function initThirdPartyLibraries() {
    // Example: Initialize a hypothetical chart library
    // if (typeof ChartLibrary !== 'undefined') {
    //     ChartLibrary.init();
    // }
}

// Call the initialization function
initThirdPartyLibraries();

