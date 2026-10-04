// ===== ТАЙМЕР ОБРАТНОГО ОТСЧЁТА =====
const weddingDate = new Date('2026-10-24T10:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    if (distance < 0) {
        document.querySelector('.countdown').innerHTML = 
            '<p style="font-size: 1.5rem; color: var(--brown-pale);">Мы уже поженились! 💕</p>';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== АУДИО ПЛЕЕР =====
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
let isPlaying = false;

// Устанавливаем начальное состояние
musicBtn.textContent = '';

musicBtn.addEventListener('click', function() {
    if (isPlaying) {
        music.pause();
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
        isPlaying = false;
    } else {
        music.play().then(function() {
            musicBtn.classList.add('playing');
            musicBtn.textContent = '🎶';
            isPlaying = true;
        }).catch(function(error) {
            console.log('Автовоспроизведение заблокировано браузером:', error);
            alert('Нажмите ещё раз для воспроизведения музыки');
        });
    }
});

// ===== УВЕДОМЛЕНИЕ О САЙТЕ =====
function closeInfo() {
    const notification = document.getElementById('infoNotification');
    const miniBtn = document.getElementById('infoMiniBtn');
    notification.classList.add('collapsed');
    miniBtn.classList.add('visible');
}

function toggleInfo() {
    const notification = document.getElementById('infoNotification');
    const miniBtn = document.getElementById('infoMiniBtn');
    if (notification.classList.contains('collapsed')) {
        notification.classList.remove('collapsed');
        miniBtn.classList.remove('visible');
    } else {
        notification.classList.add('collapsed');
        miniBtn.classList.add('visible');
    }
}

document.getElementById('infoNotification').classList.add('collapsed');
document.getElementById('infoMiniBtn').classList.add('visible');

// ===== АНИМАЦИИ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section, .venue-card, .wishes-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== ПАДАЮЩИЕ УКРАШЕНИЯ (декор) =====
function createOrnament() {
    const symbols = ['✦', '', '✧', '♥'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const ornament = document.createElement('div');
    ornament.innerHTML = symbol;
    ornament.style.position = 'fixed';
    ornament.style.top = '-20px';
    ornament.style.left = Math.random() * 100 + 'vw';
    ornament.style.color = 'var(--gold)';
    ornament.style.opacity = '0.4';
    ornament.style.fontSize = (Math.random() * 15 + 10) + 'px';
    ornament.style.pointerEvents = 'none';
    ornament.style.zIndex = '9999';
    ornament.style.animation = `fall ${Math.random() * 3 + 4}s linear forwards`;
    document.body.appendChild(ornament);
    setTimeout(() => ornament.remove(), 7000);
}

const fallStyle = document.createElement('style');
fallStyle.textContent = `@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`;
document.head.appendChild(fallStyle);

setInterval(createOrnament, 3000);

// ===== КАРУСЕЛЬ ФОТОПЛЕНКИ =====
let currentSlide = 0;
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const dotsContainer = document.getElementById('carouselDots');

// Создаем точки навигации
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
}

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveCarousel(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Автопрокрутка каждые 5 секунд
let autoPlay = setInterval(() => moveCarousel(1), 5000);

// Останавливаем автопрокрутку при наведении
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
carouselContainer.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => moveCarousel(1), 5000);
});

// Поддержка свайпа на мобильных устройствах
let touchStartX = 0;
let touchEndX = 0;

carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            moveCarousel(1);
        } else {
            moveCarousel(-1);
        }
    }
}