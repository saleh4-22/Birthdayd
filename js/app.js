// --- Setup & Configuration ---
const bgMusic = new Howl({
    src: ['assets/R570_3.m4a'],
    loop: true,
    volume: 0.8
});

const cutSound = new Howl({
    src: ['assets/cake_cut.mp3'],
    volume: 1.0
});

let isPlaying = false;
let cakeCut = false;
let canCut = false;

// --- Elements ---
const landingScreen = document.getElementById('landing');
const mainApp = document.getElementById('main-app');
const startBtn = document.getElementById('start-btn');
const musicToggle = document.getElementById('music-toggle');
const cakeContainer = document.getElementById('cake-container');
const cakeLeft = document.getElementById('cake-left');
const cakeRight = document.getElementById('cake-right');
const instruction = document.getElementById('cake-instruction');
const balloonsContainer = document.getElementById('balloons-container');
const popup = document.getElementById('surprise-popup');

// --- Entry Animation ---
startBtn.addEventListener('click', () => {
    // Hide landing
    landingScreen.classList.remove('active');
    
    // Play sound (requires user interaction first)
    // Wrap in try catch in case audio file is missing (to prevent breaking JS)
    try {
        bgMusic.play();
        isPlaying = true;
        musicToggle.classList.add('playing');
    } catch(e) { console.error("Audio not available"); }
    
    // Show main app
    setTimeout(() => {
        mainApp.classList.add('active');
        
        // GSAP Title Animation
        gsap.from("#greeting1", { y: -50, opacity: 0, duration: 1, ease: "power3.out" });
        gsap.from("#bithday-name", { scale: 0.5, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.5)", delay: 0.3 });
        gsap.from(".candles-bg", { opacity: 0, duration: 2, delay: 1 });
        gsap.from("#cake-container", { y: 100, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.8, onComplete: () => {
            canCut = true;
        }});
        
        startBalloons();
    }, 500);
});

// --- Music Toggle ---
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play();
        musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
});


// --- Swipe Interaction (Light trail + Cake collision) ---
const canvas = document.getElementById('swipe-canvas');
const ctx = canvas.getContext('2d');
let points = [];
let isSwiping = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    
    // Premium Gold Swipe Trail
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffd700';
    ctx.stroke();
}

function handleSwipePoint(x, y) {
    if (!canCut) return;
    points.push({ x, y });
    
    // Keep trail short
    if (points.length > 20) {
        points.shift();
    }
    drawTrail();

    // Check collision with cake
    if (!cakeCut) {
        const rect = cakeContainer.getBoundingClientRect();
        // roughly in the middle of the cake
        if (x > rect.left && x < rect.right && y > rect.top + 50 && y < rect.bottom - 50) {
            // Trigger Cut
            triggerCakeCut();
        }
    }
}

// Touch events
window.addEventListener('touchstart', (e) => {
    isSwiping = true;
    points = [];
    handleSwipePoint(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    handleSwipePoint(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchend', () => {
    isSwiping = false;
    // Fade out trail
    gsap.to(canvas, { opacity: 0, duration: 0.3, onComplete: () => {
        points = [];
        ctx.clearRect(0,0, canvas.width, canvas.height);
        canvas.style.opacity = 1; // reset
    }});
});

// Mouse support for testing
window.addEventListener('mousedown', (e) => {
    isSwiping = true;
    points = [];
    handleSwipePoint(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => {
    if (!isSwiping) return;
    handleSwipePoint(e.clientX, e.clientY);
});
window.addEventListener('mouseup', () => {
    isSwiping = false;
    gsap.to(canvas, { opacity: 0, duration: 0.3, onComplete: () => {
        points = [];
        ctx.clearRect(0,0, canvas.width, canvas.height);
        canvas.style.opacity = 1;
    }});
});


// --- Cake Cut Logic ---
function triggerCakeCut() {
    cakeCut = true;
    instruction.style.display = 'none'; // Completely hide instruction text

    try {
        cutSound.play();
    } catch(e) {}

    // Split the cake!
    gsap.to(cakeLeft, { x: -40, rotation: -8, duration: 1.5, ease: "power3.out" });
    gsap.to(cakeRight, { x: 40, rotation: 8, duration: 1.5, ease: "power3.out" });

    // Huge confetti explosion!
    fireConfetti();
    
    // Show final popup after delay
    setTimeout(() => {
        popup.classList.add('show');
    }, 2000);
}

function fireConfetti() {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        // launch a few confetti from the left edge
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: ['#ffd700', '#d53f8c', '#805ad5']
        });
        // and launch a few from the right edge
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: ['#ffd700', '#d53f8c', '#805ad5']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// --- Balloon System ---
function startBalloons() {
    setInterval(createBalloon, 2000); // 1 balloon every 2 seconds
}

function createBalloon() {
    if (document.hidden) return; // don't spawn if tab isn't active
    
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    // Random position across X axis
    const startX = Math.random() * (window.innerWidth - 60);
    balloon.style.left = startX + 'px';
    
    balloonsContainer.appendChild(balloon);
    
    // Animate up
    const duration = 6 + Math.random() * 4; // 6-10s
    
    gsap.to(balloon, {
        y: -window.innerHeight - 150, // Move all the way to top
        rotation: (Math.random() - 0.5) * 30, // slight wobble
        duration: duration,
        ease: "none",
        onComplete: () => {
            if (balloon.parentNode) {
                balloon.parentNode.removeChild(balloon);
            }
        }
    });
    
    // Pop Interaction
    const popAction = (e) => {
        e.stopPropagation();
        const rect = balloon.getBoundingClientRect();
        // small burst of confetti at balloon position
        confetti({
            particleCount: 20,
            spread: 40,
            origin: {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight
            },
            colors: ['#ffd700']
        });
        
        // Remove balloon
        if (balloon.parentNode) {
            balloon.parentNode.removeChild(balloon);
        }
    };

    balloon.addEventListener('touchstart', popAction);
    balloon.addEventListener('mousedown', popAction);
}

// Share Button logic
document.getElementById('share-btn').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: "Rain's 21st Birthday!",
            text: "Join me in safely celebrating Rain's 21st Birthday!",
            url: window.location.href,
        }).catch(err => console.error(err));
    } else {
        alert("Share this link with your friends!");
    }
});
