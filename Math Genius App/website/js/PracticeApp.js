import { PracticeMode } from './MathModes.js';

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const scoreEl = document.getElementById('score');
const progressEl = document.getElementById('progress');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('status');

const settings = JSON.parse(localStorage.getItem('practiceSettings') || '{}');
const questionCount = Number(settings.questionCount) || 5;
const operations = Array.isArray(settings.operations) && settings.operations.length > 0 ? settings.operations : ['+', '-', 'x', '÷'];
const difficulty = settings.difficulty || 'Easy';
const digits = difficulty === 'Hard' ? 2 : difficulty === 'Medium' ? 1 : 1;

const practice = new PracticeMode(digits, difficulty);
let currentQuestion = null;
let currentIndex = 0;
let score = 0;
let streak = 0;

function formatQuestion(question) {
    return `${question.num1} ${question.op} ${question.num2} = ?`;
}

function updateHeader() {
    scoreEl.innerText = `Score: ${score}`;
    progressEl.innerText = `Question: ${currentIndex + 1} / ${questionCount}`;
}

function loadQuestion() {
    currentQuestion = practice.practiceQuestion(operations);
    questionEl.innerText = formatQuestion(currentQuestion);
    answerEl.value = '';
    statusEl.innerText = '';
    updateHeader();
    answerEl.focus();
}

function finishPractice() {
    statusEl.innerText = `Practice complete! Final score: ${score}`;
    submitBtn.disabled = true;
    answerEl.disabled = true;

    // persist results for end page
    const lastResult = { mode: 'practice', score, streak, operation: currentQuestion?.op || (operations[0] || null), difficulty };
    localStorage.setItem('lastResult', JSON.stringify(lastResult));

    // update best streak
    const bestKey = 'bestStreak_practice';
    const prevBest = Number(localStorage.getItem(bestKey) || 0);
    if (streak > prevBest) localStorage.setItem(bestKey, String(streak));

    // redirect to end page
    setTimeout(() => window.location.href = './end.html', 800);
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
        submitBtn.innerText = `✗ Wrong`;
        submitBtn.style.backgroundColor = '#ff6b6b';
        submitBtn.style.borderColor = '#ff6b6b';
        statusEl.innerText = `Correct answer: ${currentQuestion.ans}`;
        statusEl.style.color = '#ff6b6b';
    }

    currentIndex += 1;
    submitBtn.disabled = true;

    updateHeader();

    if (currentIndex >= questionCount) {
        finishPractice();
        return;
    }

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
    if (event.key === 'Enter') checkAnswer();
});

loadQuestion();
