import { readJson, writeJson } from './storage.js';

const modeLine = document.getElementById('modeLine');
const scoreLine = document.getElementById('scoreLine');
const accuracyLine = document.getElementById('accuracyLine');
const correctLine = document.getElementById('correctLine');
const bonusLine = document.getElementById('bonusLine');
const bestLine = document.getElementById('bestLine');
const opLine = document.getElementById('opLine');
const practiceOpBtn = document.getElementById('practiceOpBtn');
const progressBtn = document.getElementById('progressBtn');
const homeBtn = document.getElementById('homeBtn');

const lastResult = readJson('lastResult');

if (!lastResult || !lastResult.mode) {
    modeLine.innerText = 'No session data found.';
    scoreLine.innerText = '';
    accuracyLine.innerText = '';
    correctLine.innerText = '';
    bonusLine.innerText = '';
    bestLine.innerText = '';
    opLine.innerText = '';
    practiceOpBtn.disabled = true;
    progressBtn.disabled = true;
} else {
    const {
        mode,
        score,
        streak,
        bestStreak,
        correctAnswers = 0,
        incorrectAnswers = 0,
        bonusPoints = 0,
        worstOperation,
        range
    } = lastResult;
    const attemptedAnswers = correctAnswers + incorrectAnswers;
    const accuracy = attemptedAnswers > 0 ? Math.round((correctAnswers / attemptedAnswers) * 100) : 0;
    modeLine.innerText = `Mode: ${mode}`;
    scoreLine.innerText = `Score: ${score}`;
    accuracyLine.innerText = `Accuracy: ${accuracy}%`;
    correctLine.innerText = `Correct answers: ${correctAnswers} | Incorrect answers: ${incorrectAnswers}`;
    bonusLine.innerText = `Bonus points: ${bonusPoints}`;
    bestLine.innerText = `Best streak this session: ${bestStreak}`;
    const isMoneyMode = mode === 'money' || mode === 'money-practice';
    practiceOpBtn.innerText = isMoneyMode ? 'Practice money again' : 'Practice this operation';
    opLine.innerText = isMoneyMode
        ? 'Keep practicing Canadian coins and bills.'
        : (worstOperation ? `Recommended operation to practice: ${worstOperation}` : 'Recommended operation to practice: any');

    practiceOpBtn.addEventListener('click', () => {
        if (isMoneyMode) {
            writeJson('practiceSettings', {
                mode: 'money',
                questionCount: 10,
                maxAmountCents: lastResult.maxAmountCents || 2500
            });
            window.location.href = './practice.html';
            return;
        }
        const op = worstOperation || '+';
        const practiceSettings = { questionCount: 10, operations: [op], range: range || { min: 1, max: 10 } };
        writeJson('practiceSettings', practiceSettings);
        window.location.href = './practice.html';
    });

    homeBtn.addEventListener('click', () => window.location.href = './index.html');
    progressBtn.addEventListener('click', () => window.location.href = './progress.html');
}
