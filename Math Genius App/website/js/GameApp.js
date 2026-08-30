import { GameMode, MoneyMode, MONEY_OVERCOUNT_BONUS } from './MathModes.js';
import { MoneySelector, formatMoney } from './MoneyMode.js';
import { evaluateMoneyAnswer } from './moneyScoring.js';
import { readJson, removeItem, writeJson } from './storage.js';
import { recordSession } from './progress.js';

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const progressEl = document.getElementById('progress');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');

const settings = readJson('gameSettings');
const { min = 1, max = 10 } = settings.range || {};
const game = new GameMode({ min, max });
const appState = {
    score: 0,
    streak: 0,
    bestStreak: 0,
    currentQuestion: null,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    bonusPoints: 0,
    wrongCounts: { '+': 0, '-': 0, 'x': 0, '÷': 0 }
};
const endBtn = document.getElementById('endBtn');
const moneyInterface = document.getElementById('moneyInterface');
const isMoneyMode = settings.mode === 'money';
const moneyGame = isMoneyMode ? new MoneyMode(settings.maxAmountCents, settings.level) : null;
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
    moneySelector.onChange = ({ pieceCount }) => {
        submitBtn.disabled = pieceCount === 0;
    };
    moneySelector.reset();
}

function formatQuestion(question) {
    return `${question.num1} ${question.op} ${question.num2} = ?`;
}

function updateStats() {
    scoreEl.innerText = `Score: ${appState.score}`;
    streakEl.innerText = `Streak: ${appState.streak}`;
}

function updateProgress() {
    progressEl.innerText = `Question: ${appState.currentQuestionIndex}`;
}

function loadQuestion() {
    appState.currentQuestionIndex += 1;
    appState.currentQuestion = isMoneyMode ? moneyGame.moneyQuestion() : game.gameQuestion();
    questionEl.innerText = isMoneyMode
        ? `Build the target amount using ${appState.currentQuestion.combinationCount} pieces or more.`
        : formatQuestion(appState.currentQuestion);
    if (isMoneyMode) {
        document.getElementById('moneyTarget').innerText = `Target: ${formatMoney(appState.currentQuestion.targetCents)}`;
        document.getElementById('moneyCombinationTarget').innerText = `Use: ${appState.currentQuestion.combinationCount} pieces`;
        moneySelector.setDenominations(appState.currentQuestion.denominations);
        moneySelector.reset();
        moneySelector.setDisabled(false);
        moneySelector.focusFirstButton();
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
    const correctAnswer = parseFloat(appState.currentQuestion.ans);
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.001;

    if (isCorrect) {
        appState.score += 10;
        appState.correctAnswers += 1;
        appState.streak += 1;
        appState.bestStreak = Math.max(appState.bestStreak, appState.streak);
        submitBtn.innerText = '✓ Correct';
        answerEl.style.backgroundColor = '#51cf66';
        submitBtn.style.backgroundColor = '#15803d';
        submitBtn.style.borderColor = '#15803d';
        statusEl.innerText = '';
        statusEl.style.color = '';
    } else {
        appState.streak = 0;
        appState.incorrectAnswers += 1;
        appState.score = Math.max(0, appState.score - 5);
        appState.wrongCounts[appState.currentQuestion.op] = (appState.wrongCounts[appState.currentQuestion.op] || 0) + 1;
        submitBtn.innerText = `✗ Wrong`;
        answerEl.style.backgroundColor = '#ff6b6b';
        submitBtn.style.backgroundColor = '#dc2626';
        submitBtn.style.borderColor = '#dc2626';
        statusEl.innerText = `Correct answer: ${appState.currentQuestion.ans}`;
        statusEl.style.color = '#b91c1c';
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

    const result = evaluateMoneyAnswer(appState.currentQuestion, { totalCents, pieceCount });
    const { isCorrect, earnedBonus } = result;

    if (isCorrect) {
        appState.score += result.points;
        appState.correctAnswers += 1;
        appState.bonusPoints += earnedBonus ? MONEY_OVERCOUNT_BONUS : 0;
        appState.streak += 1;
        appState.bestStreak = Math.max(appState.bestStreak, appState.streak);
        submitBtn.innerText = earnedBonus ? `✓ Correct +${MONEY_OVERCOUNT_BONUS} bonus` : '✓ Correct';
        submitBtn.style.backgroundColor = '#15803d';
        submitBtn.style.borderColor = '#15803d';
        statusEl.innerText = earnedBonus ? 'Correct! Bonus for finding an alternate combination!' : 'Correct!';
        statusEl.style.color = '#16803c';
    } else {
        appState.streak = 0;
        appState.incorrectAnswers += 1;
        appState.score = Math.max(0, appState.score + result.points);
        submitBtn.innerText = '✗ Wrong';
        submitBtn.style.backgroundColor = '#dc2626';
        submitBtn.style.borderColor = '#dc2626';
        statusEl.innerText = `Valid combination: ${appState.currentQuestion.validCombination.join(' + ')} = ${formatMoney(appState.currentQuestion.targetCents)}`;
        statusEl.style.color = '#b91c1c';
    }

    submitBtn.disabled = true;
    moneySelector.setDisabled(true);
    updateStats();
    setTimeout(() => {
        submitBtn.innerText = 'Submit Answer';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
        statusEl.innerText = '';
        moneySelector.reset();
        moneySelector.setDisabled(false);
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
        if (isMoneyMode) moneySelector.setDisabled(true);
        const worstOperationEntry = Object.entries(appState.wrongCounts).reduce(
            (worst, [op, count]) => (count > worst.count ? { op, count } : worst),
            { op: null, count: 0 }
        );
        const worstOperation = worstOperationEntry.count > 0 ? worstOperationEntry.op : null;

        // persist results for end page
        const lastResult = {
            mode: isMoneyMode ? 'money' : 'game',
            score: appState.score,
            streak: appState.streak,
            bestStreak: appState.bestStreak,
            correctAnswers: appState.correctAnswers,
            incorrectAnswers: appState.incorrectAnswers,
            bonusPoints: appState.bonusPoints,
            worstOperation,
            range: { min, max },
            maxAmountCents: settings.maxAmountCents
        };
        recordSession(lastResult);
        writeJson('lastResult', lastResult);

        // clear session settings after the game finishes
        removeItem('gameSettings');

        window.location.href = './end.html';
    });
}

updateStats();
loadQuestion();