import { getProgress, resetProgress } from './progress.js';

const totalsEl = document.getElementById('totals');
const achievementsEl = document.getElementById('achievements');
const sessionsEl = document.getElementById('sessions');
const resetButton = document.getElementById('resetProgressBtn');
const statusEl = document.getElementById('progressStatus');

const achievementNames = {
    'first-session': 'First session completed',
    'ten-correct': '10 correct answers',
    'five-bonus-points': '5 bonus points earned',
    'ten-question-streak': '10-question streak',
    'ninety-percent-accuracy': '90% overall accuracy'
};

function addElement(parent, className, text) {
    const element = document.createElement('div');
    element.className = className;
    element.innerText = text;
    parent.appendChild(element);
}

function modeName(mode) {
    return mode === 'money' ? 'Money Game' : mode === 'money-practice' ? 'Money Practice' : mode;
}

function render() {
    const progress = getProgress();
    const { totals } = progress;
    const accuracy = totals.questions > 0 ? Math.round((totals.correct / totals.questions) * 100) : 0;
    totalsEl.innerHTML = '';
    [
        ['Sessions', totals.sessions],
        ['Questions', totals.questions],
        ['Accuracy', `${accuracy}%`],
        ['Correct', totals.correct],
        ['Bonus points', totals.bonusPoints],
        ['Best streak', totals.bestStreak]
    ].forEach(([label, value]) => {
        const stat = document.createElement('div');
        stat.className = 'progress-stat';
        const valueElement = document.createElement('strong');
        valueElement.innerText = value;
        const labelElement = document.createElement('span');
        labelElement.innerText = label;
        stat.append(valueElement, labelElement);
        totalsEl.appendChild(stat);
    });

    achievementsEl.innerHTML = '';
    if (progress.achievements.length === 0) {
        addElement(achievementsEl, 'achievement-item', 'Complete a session to unlock your first achievement.');
    } else {
        progress.achievements.forEach(id => addElement(achievementsEl, 'achievement-item', achievementNames[id] || id));
    }

    sessionsEl.innerHTML = '';
    progress.sessions.slice(-10).reverse().forEach(session => {
        const date = new Date(session.date).toLocaleDateString();
        addElement(sessionsEl, 'session-item', `${modeName(session.mode)} | ${session.correctAnswers} correct | Score: ${session.score} | ${date}`);
    });
    if (progress.sessions.length === 0) {
        addElement(sessionsEl, 'session-item', 'No completed sessions yet.');
    }
}

resetButton.addEventListener('click', () => {
    if (window.confirm('Reset all saved progress?')) {
        resetProgress();
        render();
        statusEl.innerText = 'Progress reset.';
    }
});

render();
