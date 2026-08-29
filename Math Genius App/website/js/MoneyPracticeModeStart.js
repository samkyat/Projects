const startButton = document.getElementById('startMoneyPracticeBtn');
const questionInput = document.getElementById('quesNumInput');
const maxMoneyInput = document.getElementById('maxMoneyInput');
const increaseButton = document.getElementById('quesNumInc');
const decreaseButton = document.getElementById('quesNumDec');

increaseButton.addEventListener('click', () => questionInput.stepUp());
decreaseButton.addEventListener('click', () => questionInput.stepDown());

startButton.addEventListener('click', () => {
    const questionCount = Math.min(50, Math.max(1, Number(questionInput.value) || 5));
    const maxAmountCents = Math.min(10000, Math.max(5, Math.round((Number(maxMoneyInput.value) || 25) * 100)));

    localStorage.setItem('practiceSettings', JSON.stringify({
        mode: 'money',
        questionCount,
        maxAmountCents
    }));
    window.location.href = './practice.html';
});
