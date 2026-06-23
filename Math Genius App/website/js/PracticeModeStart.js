const startPracticeBtn = document.getElementById('startPracticeBtn');

startPracticeBtn.addEventListener('click', () => {
    const questionCount = Number(document.getElementById('quesNumList').value) || 5;
    const operations = [];
    if (document.getElementById('addition').checked) operations.push('+');
    if (document.getElementById('subtraction').checked) operations.push('-');
    if (document.getElementById('multiplication').checked) operations.push('x');
    if (document.getElementById('division').checked) operations.push('÷');

    if (operations.length === 0) {
        alert('Select at least one operation for practice.');
        return;
    }

    const difficulty = document.querySelector('input[name="Difficulty"]:checked')?.value || 'Easy';
    localStorage.setItem('practiceSettings', JSON.stringify({ questionCount, operations, difficulty }));
    window.location.href = './practice.html';
});
