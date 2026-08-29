import { GameMode, MoneyMode, MONEY_OVERCOUNT_BONUS } from './MathModes.js';
import { MoneySelector, formatMoney } from './MoneyMode.js';

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
const moneyInterface = document.getElementById('moneyInterface');
const isMoneyMode = settings.mode === 'money';
const moneyGame = isMoneyMode ? new MoneyMode(settings.maxAmountCents) : null;
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
    currentQuestion = isMoneyMode ? moneyGame.moneyQuestion() : game.gameQuestion();
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
    updateProgress();
    if (!isMoneyMode) answerEl.focus();
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
        score = Math.max(0, score - 5);
        wrongCounts[currentQuestion.op] = (wrongCounts[currentQuestion.op] || 0) + 1;
        submitBtn.innerText = `✗ Wrong`;
        answerEl.style.backgroundColor = '#ff6b6b';
        submitBtn.style.backgroundColor = '#ff6b6b';
        submitBtn.style.borderColor = '#ff6b6b';
        statusEl.innerText = `Correct answer: ${currentQuestion.ans}`;
        statusEl.style.color = '#ff6b6b';
    }

    submitBtn.disabled = true;
    updateStats();
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
        score = Math.max(0, score - 5);
        submitBtn.innerText = '✗ Wrong';
        submitBtn.style.backgroundColor = '#ff6b6b';
        submitBtn.style.borderColor = '#ff6b6b';
        statusEl.innerText = `Valid combination: ${currentQuestion.validCombination.join(' + ')} = ${formatMoney(currentQuestion.targetCents)}`;
        statusEl.style.color = '#ff6b6b';
    }

    submitBtn.disabled = true;
    updateStats();
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
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

answerEl.addEventListener('input', function() {
  // This instantly replaces anything that is NOT a number (0-9), 
  // minus (-), plus (+), or decimal (.) with nothing.
  this.value = this.value.replace(/[^0-9\-\+\.]/g, '');
});

if (endBtn) {
    endBtn.addEventListener('click', () => {
        const worstOperationEntry = Object.entries(wrongCounts).reduce(
            (worst, [op, count]) => (count > worst.count ? { op, count } : worst),
            { op: null, count: 0 }
        );
        const worstOperation = worstOperationEntry.count > 0 ? worstOperationEntry.op : null;

        // persist results for end page
        const lastResult = {
            mode: isMoneyMode ? 'money' : 'game',
            score,
            streak,
            bestStreak,
            worstOperation,
            range: { min, max },
            maxAmountCents: settings.maxAmountCents
        };
        localStorage.setItem('lastResult', JSON.stringify(lastResult));

        // clear session settings after the game finishes
        localStorage.removeItem('gameSettings');

        window.location.href = './end.html';
    });
}

updateStats();
loadQuestion();