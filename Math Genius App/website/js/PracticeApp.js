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
const { min = 1, max = 10 } = settings.range || {};

const practice = new PracticeMode({ min, max });
let currentQuestion = null;
let currentIndex = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
const wrongCounts = operations.reduce((counts, op) => {
    counts[op] = 0;
    return counts;
}, {});

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

    const worstOperationEntry = Object.entries(wrongCounts).reduce(
        (worst, [op, count]) => (count > worst.count ? { op, count } : worst),
        { op: null, count: 0 }
    );
    const worstOperation = worstOperationEntry.count > 0 ? worstOperationEntry.op : null;

    // persist results for end page
    const lastResult = { mode: 'practice', score, streak, bestStreak, worstOperation, range: { min, max } };
    localStorage.setItem('lastResult', JSON.stringify(lastResult));

    // clear session settings after practice finishes
    localStorage.removeItem('practiceSettings');

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
        bestStreak = Math.max(bestStreak, streak);
        submitBtn.innerText = '✓ Correct';
        answerEl.style.backgroundColor = '#51cf66';
        submitBtn.style.backgroundColor = '#51cf66';
        submitBtn.style.borderColor = '#51cf66';
        statusEl.innerText = '';
        statusEl.style.color = '';
    } else {
        streak = 0;
        wrongCounts[currentQuestion.op] = (wrongCounts[currentQuestion.op] || 0) + 1;
        submitBtn.innerText = `✗ Wrong`;
        answerEl.style.backgroundColor = '#ff6b6b';
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
        answerEl.style.backgroundColor = '';
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

answerEl.addEventListener('input', function() {
  // This instantly replaces anything that is NOT a number (0-9), 
  // minus (-), plus (+), or decimal (.) with nothing.
  this.value = this.value.replace(/[^0-9\-\+\.]/g, '');
});

loadQuestion();
