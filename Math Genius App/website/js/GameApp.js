import { GameMode } from './MathModes.js';

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const progressEl = document.getElementById('progress');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');

const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
const { min = 1, max = 10 } = settings.range || {};
const game = new GameMode({ min, max });
let currentQuestion = null;
let score = 0;
let streak = 0;
let bestStreak = 0;
let currentQuestionIndex = 0;
const wrongCounts = { '+': 0, '-': 0, 'x': 0, '÷': 0 };
const endBtn = document.getElementById('endBtn');

function formatQuestion(question) {
    return `${question.num1} ${question.op} ${question.num2} = ?`;
}

function updateStats() {
    scoreEl.innerText = `Score: ${score}`;
    streakEl.innerText = `Streak: ${streak}`;
}

function updateProgress() {
    progressEl.innerText = `Question: ${currentQuestionIndex}`;
}

function loadQuestion() {
    currentQuestionIndex += 1;
    currentQuestion = game.gameQuestion();
    questionEl.innerText = formatQuestion(currentQuestion);
    answerEl.value = '';
    statusEl.innerText = '';
    updateProgress();
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
        bestStreak = Math.max(bestStreak, streak);
        submitBtn.innerText = '✓ Correct';
        submitBtn.style.backgroundColor = '#51cf66';
        submitBtn.style.borderColor = '#51cf66';
        statusEl.innerText = '';
        statusEl.style.color = '';
    } else {
        streak = 0;
        score = Math.max(0, score - 5);
        wrongCounts[currentQuestion.op] = (wrongCounts[currentQuestion.op] || 0) + 1;
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
    }, 1500);
}

submitBtn.addEventListener('click', checkAnswer);
answerEl.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

if (endBtn) {
    endBtn.addEventListener('click', () => {
        const worstOperationEntry = Object.entries(wrongCounts).reduce(
            (worst, [op, count]) => (count > worst.count ? { op, count } : worst),
            { op: null, count: 0 }
        );
        const worstOperation = worstOperationEntry.count > 0 ? worstOperationEntry.op : null;

        // persist results for end page
        const lastResult = { mode: 'game', score, streak, bestStreak, worstOperation, range: { min, max } };
        localStorage.setItem('lastResult', JSON.stringify(lastResult));

        // clear session settings after the game finishes
        localStorage.removeItem('gameSettings');

        window.location.href = './end.html';
    });
}

updateStats();
loadQuestion();