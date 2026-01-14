/* ============================================
   PRONOUN LEARNING APP - GAME LOGIC
   Scalable question system with animations
   ============================================ */

// ============================================
// QUESTION DATA - Easy to add new questions!
// ============================================
const questions = [
    // HIM questions (answer: boy)
    {
        sentence: "Give the ball to",
        pronoun: "HIM",
        answer: "boy",
        pronounType: "him",
        audioFile: "audio/give_ball_him.mp3"
    },
    {
        sentence: "Wave to",
        pronoun: "HIM",
        answer: "boy",
        pronounType: "him",
        audioFile: "audio/wave_him.mp3"
    },
    {
        sentence: "Clap for",
        pronoun: "HIM",
        answer: "boy",
        pronounType: "him",
        audioFile: "audio/clap_him.mp3"
    },
    {
        sentence: "Smile at",
        pronoun: "HIM",
        answer: "boy",
        pronounType: "him",
        audioFile: "audio/smile_him.mp3"
    },

    // HER questions (answer: girl)
    {
        sentence: "Give the flower to",
        pronoun: "HER",
        answer: "girl",
        pronounType: "her",
        audioFile: "audio/give_flower_her.mp3"
    },
    {
        sentence: "Wave to",
        pronoun: "HER",
        answer: "girl",
        pronounType: "her",
        audioFile: "audio/wave_her.mp3"
    },
    {
        sentence: "Clap for",
        pronoun: "HER",
        answer: "girl",
        pronounType: "her",
        audioFile: "audio/clap_her.mp3"
    },
    {
        sentence: "Smile at",
        pronoun: "HER",
        answer: "girl",
        pronounType: "her",
        audioFile: "audio/smile_her.mp3"
    },

    // HE questions (answer: boy)
    {
        sentence: "is happy!",
        pronoun: "HE",
        answer: "boy",
        pronounType: "he",
        pronounFirst: true,
        audioFile: "audio/he_happy.mp3"
    },
    {
        sentence: "is dancing!",
        pronoun: "HE",
        answer: "boy",
        pronounType: "he",
        pronounFirst: true,
        audioFile: "audio/he_dancing.mp3"
    },

    // SHE questions (answer: girl)
    {
        sentence: "is happy!",
        pronoun: "SHE",
        answer: "girl",
        pronounType: "she",
        pronounFirst: true,
        audioFile: "audio/she_happy.mp3"
    },
    {
        sentence: "is dancing!",
        pronoun: "SHE",
        answer: "girl",
        pronounType: "she",
        pronounFirst: true,
        audioFile: "audio/she_dancing.mp3"
    }
];

// ============================================
// CHARACTER POOLS - Diverse representation!
// ============================================
const boyCharacters = ['boy.png', 'boy2.png', 'boy3.png', 'boy4.png'];
const girlCharacters = ['girl.png', 'girl2.png', 'girl3.png', 'girl4.png'];

// ============================================
// GAME STATE
// ============================================
let currentQuestion = null;
let lastQuestionIndex = -1;
let currentBoyImage = '';
let currentGirlImage = '';
let score = 0;
let isProcessing = false;
let gameStarted = false;

// ============================================
// DOM ELEMENTS
// ============================================
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const promptText = document.getElementById('prompt-text');
const boyBtn = document.getElementById('boy-btn');
const girlBtn = document.getElementById('girl-btn');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackText = document.getElementById('feedback-text');
const scoreDisplay = document.getElementById('score');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

// Get the image elements inside the buttons
const boyImg = boyBtn.querySelector('.character-img');
const girlImg = girlBtn.querySelector('.character-img');

// ============================================
// AUDIO SYSTEM (ElevenLabs Pre-generated Audio)
// ============================================
let currentAudio = null;

// Audio files for feedback
const feedbackAudio = {
    correct: 'audio/great_job.mp3',
    incorrect: 'audio/try_again.mp3'
};

function playAudio(audioFile) {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(audioFile);
    currentAudio.play().catch(err => {
        console.warn('Audio playback failed:', err);
    });
}

function playQuestionAudio(question) {
    if (question.audioFile) {
        playAudio(question.audioFile);
    }
}

function playFeedbackAudio(isCorrect) {
    const audioFile = isCorrect ? feedbackAudio.correct : feedbackAudio.incorrect;
    playAudio(audioFile);
}

// ============================================
// CONFETTI SYSTEM
// ============================================
// (Keep existing confetti system code...)
let confettiParticles = [];
let animationId = null;

function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function createConfetti() {
    const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#C44DFF', '#FF9F43', '#54A0FF'];
    const particles = [];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 12 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 4 + 3,
            speedX: Math.random() * 4 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }

    return particles;
}

function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach((p, index) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // Update position
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Add gravity and drag
        p.speedY += 0.1;
        p.speedX *= 0.99;
    });

    // Remove particles that have fallen off screen
    confettiParticles = confettiParticles.filter(p => p.y < confettiCanvas.height + 50);

    if (confettiParticles.length > 0) {
        animationId = requestAnimationFrame(drawConfetti);
    }
}

function startConfetti() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    confettiParticles = createConfetti();
    drawConfetti();
}

// ============================================
// GAME FUNCTIONS
// ============================================

function getRandomQuestion() {
    let newIndex;
    // Avoid repeating the same question
    do {
        newIndex = Math.floor(Math.random() * questions.length);
    } while (newIndex === lastQuestionIndex && questions.length > 1);

    lastQuestionIndex = newIndex;
    return questions[newIndex];
}

function getRandomCharacter(pool, lastImage) {
    let newImage;
    do {
        newImage = pool[Math.floor(Math.random() * pool.length)];
    } while (newImage === lastImage && pool.length > 1);
    return newImage;
}

function updateCharacterImages() {
    currentBoyImage = getRandomCharacter(boyCharacters, currentBoyImage);
    currentGirlImage = getRandomCharacter(girlCharacters, currentGirlImage);

    // Reset any previous animations by cloning and replacing nodes or just toggling classes
    // Actually, setting src will trigger the image load. The CSS animation is on the button.
    boyBtn.style.animation = 'none';
    girlBtn.style.animation = 'none';

    // Trigger reflow to restart animation
    void boyBtn.offsetWidth;
    void girlBtn.offsetWidth;

    boyBtn.style.animation = '';
    girlBtn.style.animation = '';

    boyImg.src = currentBoyImage;
    girlImg.src = currentGirlImage;
}

function displayQuestion(question) {
    if (question.pronounFirst) {
        promptText.innerHTML = `<span class="pronoun-highlight" id="pronoun-highlight">${question.pronoun}</span> ${question.sentence}`;
    } else {
        promptText.innerHTML = `${question.sentence} <span class="pronoun-highlight" id="pronoun-highlight">${question.pronoun}</span>`;
    }

    // Play the pre-recorded audio for this question
    playQuestionAudio(question);
}

function loadNextQuestion() {
    currentQuestion = getRandomQuestion();
    updateCharacterImages();
    displayQuestion(currentQuestion);
}

function showFeedback(isCorrect) {
    if (isCorrect) {
        feedbackIcon.textContent = '⭐';
        feedbackText.textContent = 'Correct!';
        feedbackText.style.color = '#4CD964';
    } else {
        feedbackIcon.textContent = '💫';
        feedbackText.textContent = 'Try again!';
        feedbackText.style.color = '#FF9500';
    }

    feedbackOverlay.classList.add('show');
}

function hideFeedback() {
    feedbackOverlay.classList.remove('show');
}

function handleAnswer(selectedGender, buttonElement) {
    if (isProcessing || !gameStarted) return;
    isProcessing = true;

    const isCorrect = selectedGender === currentQuestion.answer;

    if (isCorrect) {
        buttonElement.classList.add('correct');
        score++;
        scoreDisplay.textContent = score;

        startConfetti();
        showFeedback(true);
        playFeedbackAudio(true);

        setTimeout(() => {
            buttonElement.classList.remove('correct');
            hideFeedback();
            loadNextQuestion();
            isProcessing = false;
        }, 2000);

    } else {
        buttonElement.classList.add('shake');
        playFeedbackAudio(false);

        setTimeout(() => {
            buttonElement.classList.remove('shake');
            isProcessing = false;
        }, 600);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

startBtn.addEventListener('click', () => {
    gameStarted = true;
    startScreen.classList.add('hidden');
    loadNextQuestion();
});

boyBtn.addEventListener('click', () => handleAnswer('boy', boyBtn));
girlBtn.addEventListener('click', () => handleAnswer('girl', girlBtn));

// Touch events
boyBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleAnswer('boy', boyBtn);
});

girlBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleAnswer('girl', girlBtn);
});

window.addEventListener('resize', resizeCanvas);

document.addEventListener('touchend', (e) => {
    // Only prevent default if it's not a button click to avoid breaking interaction
    if (!e.target.closest('button')) {
        e.preventDefault();
    }
}, { passive: false });

// ============================================
// INITIALIZATION
// ============================================

function init() {
    resizeCanvas();
    initTTS();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
