import { PracticeMode, MoneyMode, MONEY_OVERCOUNT_BONUS } from './MathModes.js';
import { MoneySelector, formatMoney } from './MoneyMode.js';

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const scoreEl = document.getElementById('score');
const progressEl = document.getElementById('progress');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('status');
const moneyInterface = document.getElementById('moneyInterface');

const settings = JSON.parse(localStorage.getItem('practiceSettings') || '{}');
const questionCount = Number(settings.questionCount) || 5;
const operations = Array.isArray(settings.operations) && settings.operations.length > 0 ? settings.operations : ['+', '-', 'x', '÷'];
const { min = 1, max = 10 } = settings.range || {};
const isMoneyMode = settings.mode === 'money';
const moneyPractice = isMoneyMode ? new MoneyMode(settings.maxAmountCents) : null;
const moneySelector = isMoneyMode ? new MoneySelector({
    buttonContainer: document.getElementById('moneyButtons'),
    selectionContainer: document.getElementById('moneySelection'),
    totalElement: document.getElementById('moneyTotal'),
    countElement: document.getElementById('moneyCount'),
    clearButton: document.getElementById('clearMoneyBtn')
}) : null;

if (isMoneyMode) {
    moneyInterface.hidden = false;
    answerEl.hidden = true;
}

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
    currentQuestion = isMoneyMode ? moneyPractice.moneyQuestion() : practice.practiceQuestion(operations);
    questionEl.innerText = isMoneyMode
        ? `Build the target amount using ${currentQuestion.combinationCount} pieces or more.`
        : formatQuestion(currentQuestion);
    if (isMoneyMode) {
        document.getElementById('moneyTarget').innerText = `Target: ${formatMoney(currentQuestion.targetCents)}`;
        document.getElementById('moneyCombinationTarget').innerText = `Use: ${currentQuestion.combinationCount} pieces`;
        moneySelector.reset();
    } else {
        answerEl.value = '';
    }
    statusEl.innerText = '';
    updateHeader();
    if (!isMoneyMode) answerEl.focus();
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
    const lastResult = {
        mode: isMoneyMode ? 'money-practice' : 'practice',
        score,
        streak,
        bestStreak,
        worstOperation,
        range: { min, max },
        maxAmountCents: settings.maxAmountCents
    };
    localStorage.setItem('lastResult', JSON.stringify(lastResult));

    // clear session settings after practice finishes
    localStorage.removeItem('practiceSettings');

    // redirect to end page
    setTimeout(() => window.location.href = './end.html', 800);
}

function checkAnswer() {
    if (isMoneyMode) {
        checkMoneyAnswer();
        return;
    }
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

function checkMoneyAnswer() {
    const { totalCents, pieceCount } = moneySelector.getAnswer();
    if (totalCents === 0) {
        statusEl.innerText = 'Select some coins or bills first.';
        return;
    }

    const amountIsCorrect = totalCents === currentQuestion.targetCents;
    const countIsEnough = pieceCount >= currentQuestion.combinationCount;
    const isCorrect = amountIsCorrect && countIsEnough;
    const earnedBonus = isCorrect && pieceCount > currentQuestion.combinationCount;

    if (isCorrect) {
        score += 10 + (earnedBonus ? MONEY_OVERCOUNT_BONUS : 0);
        streak += 1;
        bestStreak = Math.max(bestStreak, streak);
        submitBtn.innerText = earnedBonus ? `✓ Correct +${MONEY_OVERCOUNT_BONUS} bonus` : '✓ Correct';
        submitBtn.style.backgroundColor = '#51cf66';
        submitBtn.style.borderColor = '#51cf66';
        statusEl.innerText = earnedBonus ? 'Bonus for finding an alternate combination!' : '';
        statusEl.style.color = '#16803c';
    } else {
        streak = 0;
        submitBtn.innerText = '✗ Wrong';
        submitBtn.style.backgroundColor = '#ff6b6b';
        submitBtn.style.borderColor = '#ff6b6b';
        statusEl.innerText = `Valid combination: ${currentQuestion.validCombination.join(' + ')} = ${formatMoney(currentQuestion.targetCents)}`;
        statusEl.style.color = '#ff6b6b';
    }

    if (!isCorrect) {
        submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.innerText = 'Submit Answer';
            submitBtn.style.backgroundColor = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
            statusEl.innerText = '';
            moneySelector.reset();
        }, 2000);
        return;
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
        statusEl.innerText = '';
        moneySelector.reset();
        loadQuestion();
    }, 2000);
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
