const modeLine = document.getElementById('modeLine');
const scoreLine = document.getElementById('scoreLine');
const bestLine = document.getElementById('bestLine');
const opLine = document.getElementById('opLine');
const practiceOpBtn = document.getElementById('practiceOpBtn');
const homeBtn = document.getElementById('homeBtn');

const lastResult = JSON.parse(localStorage.getItem('lastResult') || '{}');

if (!lastResult || !lastResult.mode) {
    modeLine.innerText = 'No session data found.';
    scoreLine.innerText = '';
    bestLine.innerText = '';
    opLine.innerText = '';
    practiceOpBtn.disabled = true;
} else {
    const { mode, score, streak, bestStreak, worstOperation, range } = lastResult;
    modeLine.innerText = `Mode: ${mode}`;
    scoreLine.innerText = `Score: ${score}`;
    bestLine.innerText = `Best streak this session: ${bestStreak}`;
    opLine.innerText = worstOperation ? `Recommended operation to practice: ${worstOperation}` : 'Recommended operation to practice: any';

    practiceOpBtn.addEventListener('click', () => {
        const op = worstOperation || '+';
        const practiceSettings = { questionCount: 10, operations: [op], range: range || { min: 1, max: 10 } };
        localStorage.setItem('practiceSettings', JSON.stringify(practiceSettings));
        window.location.href = './practice.html';
    });

    homeBtn.addEventListener('click', () => window.location.href = './index.html');
}
