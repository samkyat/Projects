import { writeJson } from './storage.js';

const startButton = document.getElementById('startMoneyGameBtn');

const levelRanges = {
    beginner: 2500,
    intermediate: 5000,
    pro: 10000
};

startButton.addEventListener('click', () => {
    const level = document.querySelector('input[name="level"]:checked').value;
    writeJson('gameSettings', {
        mode: 'money',
        level,
        maxAmountCents: levelRanges[level]
    });
    window.location.href = './game.html';
});
