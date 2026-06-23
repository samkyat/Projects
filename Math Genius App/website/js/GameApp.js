import { GameMode } from './MathModes.js';

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');

const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
const difficulty = settings.difficulty || 'Easy';
const digits = difficulty === 'Hard' ? 2 : difficulty === 'Medium' ? 1 : 1;

const game = new GameMode(digits, difficulty);
let currentQuestion = null;
let score = 0;
let streak = 0;
const endBtn = document.getElementById('endBtn');

function formatQuestion(question) {
    return `${question.num1} ${question.op} ${question.num2} = ?`;
}

function updateStats() {
    scoreEl.innerText = `Score: ${score}`;
    streakEl.innerText = `Streak: ${streak}`;
}

function loadQuestion() {
    currentQuestion = game.gameQuestion();
    questionEl.innerText = formatQuestion(currentQuestion);
    answerEl.value = '';
    statusEl.innerText = '';
    answerEl.focus();
}

function checkAnswer() {
    const answerText = answerEl.value.trim();
    if (!answerText) {
        statusEl.innerText = 'Please enter an answer.';
        return;
    }

    const userAnswer = parseFloat(answerText);
    const correctAnswer = parseFloat(currentQuestion.ans);
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.001;

    if (isCorrect) {
        score += 10;
        streak += 1;
        submitBtn.innerText = '✓ Correct';
        submitBtn.style.backgroundColor = '#51cf66';
        submitBtn.style.borderColor = '#51cf66';
        statusEl.innerText = '';
        statusEl.style.color = '';
    } else {
        streak = 0;
        score = Math.max(0, score - 5);
        submitBtn.innerText = `✗ Wrong`;
        submitBtn.style.backgroundColor = '#ff6b6b';
        submitBtn.style.borderColor = '#ff6b6b';
        statusEl.innerText = `Correct answer: ${currentQuestion.ans}`;
        statusEl.style.color = '#ff6b6b';
    }

    submitBtn.disabled = true;
    updateStats();
    setTimeout(() => {
        submitBtn.innerText = 'Submit Answer';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
        loadQuestion();
    }, 2000);
}

submitBtn.addEventListener('click', checkAnswer);
answerEl.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

if (endBtn) {
    endBtn.addEventListener('click', () => {
        // persist results for end page
        const lastResult = { mode: 'game', score, streak, operation: currentQuestion?.op || null, difficulty };
        localStorage.setItem('lastResult', JSON.stringify(lastResult));

        // update best streak
        const bestKey = 'bestStreak_game';
        const prevBest = Number(localStorage.getItem(bestKey) || 0);
        if (streak > prevBest) localStorage.setItem(bestKey, String(streak));

        window.location.href = './end.html';
    });
}

updateStats();
loadQuestion();