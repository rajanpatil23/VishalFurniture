/* ===========================
   NAVBAR SCROLL
   =========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===========================
   MOBILE NAV
   =========================== */
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navLinks = document.getElementById('navLinks');

function openMenu() {
    navToggle.classList.add('active');
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
}

navToggle.addEventListener('click', openMenu);
navClose.addEventListener('click', closeMenu);

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
});

/* ===========================
   THEME TOGGLE
   Light = default (no class)
   Dark  = body.dark
   =========================== */
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('vfs-theme');

if (saved === 'dark') {
    document.body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('vfs-theme', isDark ? 'dark' : 'light');
});

/* ===========================
   SLIDER (with dots)
   =========================== */
const cards = document.querySelectorAll('.slider-card');
const dots = document.querySelectorAll('.s-dot');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
let idx = 0;
let timer;

function showSlide(i) {
    cards[idx].classList.remove('active');
    dots[idx].classList.remove('active');
    idx = (i + cards.length) % cards.length;
    cards[idx].classList.add('active');
    dots[idx].classList.add('active');
}

prevBtn.addEventListener('click', () => { showSlide(idx - 1); resetTimer(); });
nextBtn.addEventListener('click', () => { showSlide(idx + 1); resetTimer(); });

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        showSlide(parseInt(dot.dataset.i));
        resetTimer();
    });
});

// Touch swipe
let sx = 0;
const track = document.getElementById('sliderTrack');
track.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; }, { passive: true });
track.addEventListener('touchend', e => {
    const diff = sx - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { showSlide(diff > 0 ? idx + 1 : idx - 1); resetTimer(); }
}, { passive: true });

function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(idx + 1), 5000);
}
timer = setInterval(() => showSlide(idx + 1), 5000);

/* ===========================
   SCROLL REVEAL
   =========================== */
const revealEls = document.querySelectorAll(
    '.tag, .heading-lg, .about-right, .stats-row, .full-caption-inner, .slider-card-body, .section-header, .footer-brand-col, .footer-col, .review-card, .reviews-tagline, .google-badge'
);
revealEls.forEach(el => el.classList.add('reveal'));

const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ===========================
   COUNTER ANIMATION
   =========================== */
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(c => {
        const target = +c.dataset.target;
        const t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / 2200, 1);
            c.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
            else c.textContent = target;
        })(t0);
    });
}

const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounters(); statsObs.disconnect(); }
    });
}, { threshold: 0.3 });

const sr = document.querySelector('.stats-row');
if (sr) statsObs.observe(sr);

/* ===========================
   SMOOTH ANCHOR SCROLL
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
});

/* ===========================
   REVIEWS MOBILE SLIDESHOW
   Only activates on screens <= 600px
   =========================== */
const reviewCards = document.querySelectorAll('.reviews-grid .review-card');
const rDots = document.querySelectorAll('.r-dot');
let rIdx = 0;
let rTimer = null;

function isMobile() {
    return window.innerWidth <= 600;
}

function showReview(i) {
    if (!isMobile()) return;
    reviewCards[rIdx].classList.remove('r-active');
    rDots[rIdx].classList.remove('active');
    rIdx = (i + reviewCards.length) % reviewCards.length;
    reviewCards[rIdx].classList.add('r-active');
    rDots[rIdx].classList.add('active');
}

function resetRTimer() {
    clearInterval(rTimer);
    rTimer = setInterval(() => showReview(rIdx + 1), 4000);
}

function initMobileReviews() {
    if (isMobile()) {
        // Set first card active
        reviewCards.forEach(c => c.classList.remove('r-active'));
        rDots.forEach(d => d.classList.remove('active'));
        rIdx = 0;
        reviewCards[0].classList.add('r-active');
        rDots[0].classList.add('active');
        resetRTimer();
    } else {
        // Desktop: clear timer, remove r-active (CSS grid handles display)
        clearInterval(rTimer);
        reviewCards.forEach(c => c.classList.remove('r-active'));
    }
}

// Dot clicks
rDots.forEach(dot => {
    dot.addEventListener('click', () => {
        showReview(parseInt(dot.dataset.ri));
        resetRTimer();
    });
});

// Touch swipe on reviews
const reviewsGrid = document.querySelector('.reviews-grid');
let rsx = 0;
reviewsGrid.addEventListener('touchstart', e => { rsx = e.changedTouches[0].screenX; }, { passive: true });
reviewsGrid.addEventListener('touchend', e => {
    if (!isMobile()) return;
    const diff = rsx - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
        showReview(diff > 0 ? rIdx + 1 : rIdx - 1);
        resetRTimer();
    }
}, { passive: true });

// Init on load & resize
initMobileReviews();
window.addEventListener('resize', initMobileReviews);
