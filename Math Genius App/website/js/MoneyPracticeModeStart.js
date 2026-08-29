import { writeJson } from './storage.js';

const startButton = document.getElementById('startMoneyPracticeBtn');
const questionInput = document.getElementById('quesNumInput');
const maxMoneyInput = document.getElementById('maxMoneyInput');
const increaseButton = document.getElementById('quesNumInc');
const decreaseButton = document.getElementById('quesNumDec');
const difficultyInput = document.querySelector('input[name="difficulty"]:checked');

increaseButton.addEventListener('click', () => questionInput.stepUp());
decreaseButton.addEventListener('click', () => questionInput.stepDown());

startButton.addEventListener('click', () => {
    const questionCount = Math.min(50, Math.max(1, Number(questionInput.value) || 5));
    const moneyType = document.querySelector('input[name="moneyType"]:checked').value;
    const moneyTypes = moneyType === 'both' ? ['coin', 'bill'] : [moneyType];
    const minimumAmountCents = moneyType === 'bill' ? 500 : 5;
    const maxAmountCents = Math.min(10000, Math.max(
        minimumAmountCents,
        Math.round((Number(maxMoneyInput.value) || 25) * 100)
    ));

    writeJson('practiceSettings', {
        mode: 'money',
        questionCount,
        maxAmountCents,
        difficulty: difficultyInput.value,
        moneyTypes,
        showHints: document.getElementById('showHints').checked
    });
    window.location.href = './practice.html';
});
