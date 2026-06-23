const modeLine = document.getElementById('modeLine');
const scoreLine = document.getElementById('scoreLine');
const bestLine = document.getElementById('bestLine');
const opLine = document.getElementById('opLine');
const practiceOpBtn = document.getElementById('practiceOpBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const homeBtn = document.getElementById('homeBtn');

const lastResult = JSON.parse(localStorage.getItem('lastResult') || '{}');

if (!lastResult || !lastResult.mode) {
    modeLine.innerText = 'No session data found.';
    scoreLine.innerText = '';
    bestLine.innerText = '';
    opLine.innerText = '';
    practiceOpBtn.disabled = true;
    playAgainBtn.disabled = true;
} else {
    const { mode, score, streak, operation, difficulty } = lastResult;
    modeLine.innerText = `Mode: ${mode}`;
    scoreLine.innerText = `Score: ${score}`;

    const bestKey = mode === 'game' ? 'bestStreak_game' : 'bestStreak_practice';
    const best = Number(localStorage.getItem(bestKey) || 0);
    bestLine.innerText = `Best streak (${mode}): ${best}`;

    opLine.innerText = operation ? `Operation to work on: ${operation}` : 'Operation to work on: any';

    practiceOpBtn.addEventListener('click', () => {
        const op = operation || '+';
        const practiceSettings = { questionCount: 10, operations: [op], difficulty: difficulty || 'Easy' };
        localStorage.setItem('practiceSettings', JSON.stringify(practiceSettings));
        window.location.href = './practice.html';
    });

    playAgainBtn.addEventListener('click', () => {
        const gameSettings = { difficulty: difficulty || 'Easy' };
        localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
        window.location.href = './game.html';
    });

    homeBtn.addEventListener('click', () => window.location.href = './home.html');
}
