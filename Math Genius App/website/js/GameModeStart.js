const startGameBtn = document.getElementById('startGameBtn');

startGameBtn.addEventListener('click', () => {
    let min = Number(document.getElementById('minValueInput').value) || 1;
    let max = Number(document.getElementById('maxValueInput').value) || 10;
    if (min < 1) min = 1;
    if (max < 1) max = 10;
    if (min > max) [min, max] = [max, min];

    localStorage.setItem('gameSettings', JSON.stringify({ range: { min, max } }));
    window.location.href = './game.html';
});
