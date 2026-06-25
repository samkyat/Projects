const startPracticeBtn = document.getElementById('startPracticeBtn');
const quesNumInput = document.getElementById('quesNumInput');
const quesNumInc = document.getElementById('quesNumInc');
const quesNumDec = document.getElementById('quesNumDec');

quesNumInc.addEventListener('click', () => quesNumInput.stepUp());
quesNumDec.addEventListener('click', () => quesNumInput.stepDown());

startPracticeBtn.addEventListener('click', () => {
    const questionCount = Number(quesNumInput.value) || 5;
    const operations = [];
    if (document.getElementById('addition').checked) operations.push('+');
    if (document.getElementById('subtraction').checked) operations.push('-');
    if (document.getElementById('multiplication').checked) operations.push('x');
    if (document.getElementById('division').checked) operations.push('÷');

    if (operations.length === 0) {
        alert('Select at least one operation for practice.');
        return;
    }

    let min = Number(document.getElementById('minValueInput').value) || 1;
    let max = Number(document.getElementById('maxValueInput').value) || 10;
    if (min < 1) min = 1;
    if (max < 1) max = 10;
    if (min > max) [min, max] = [max, min];

    localStorage.setItem('practiceSettings', JSON.stringify({ questionCount, operations, range: { min, max } }));
    window.location.href = './practice.html';
});
