const startGameBtn = document.getElementById('startGameBtn');

startGameBtn.addEventListener('click', () => {
    const difficulty = document.querySelector('input[name="Difficulty"]:checked')?.value || 'Easy';
    localStorage.setItem('gameSettings', JSON.stringify({ difficulty }));
    window.location.href = './game.html';
});
