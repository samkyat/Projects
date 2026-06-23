export class MathMode {
    constructor(numOfDigits, difficulty){
        this.numOfDigits = numOfDigits;
        this.difficulty = difficulty || 'Easy';
    }

    questionSolver(op, num1, num2){
        if (op == "+"){
            return num1 + num2;
        }  
        else if (op == "-"){
            return num1 - num2;
        }
        else if (op == "x"){
            return num1 * num2;
        }
        else if (op == "÷"){
            const result = num1 / num2;
            return result % 1 === 0 ? Math.floor(result) : parseFloat(result.toFixed(2));
        }
        return null;
    }

    questionGenerator(op){
        const num1 = this.randomNumberPicker();
        const num2 = op === "÷" ? this.randomNonZeroPicker() : this.randomNumberPicker();
        const ans = this.questionSolver(op, num1, num2);
        return {op, num1, num2, ans};
    }

    randomNumberPicker(){
        return Math.floor(Math.random() * (10**this.numOfDigits));
    }

    randomNonZeroPicker(){
        let value;
        do {
            value = this.randomNumberPicker();
        } while (value === 0);
        return value;
    }

    generateEasyDivision(){
        const num2 = this.randomNonZeroPicker();
        const num1 = num2 * Math.floor(Math.random() * 9 + 1);
        const ans = Math.floor(num1 / num2);
        return {op: '÷', num1, num2, ans};
    }
}

export class GameMode extends MathMode {
    constructor(numOfDigits, difficulty){
        super(numOfDigits, difficulty);
    }

    gameQuestion(){
        const operations = ["+", "-", "x", "÷"];
        const opChoice = operations[Math.floor(Math.random() * operations.length)];
        
        if (this.difficulty === 'Easy' && opChoice === '÷') {
            return super.generateEasyDivision();
        }
        return super.questionGenerator(opChoice);
    }
}
export class PracticeMode extends MathMode {
    constructor(numOfDigits, difficulty){
        super(numOfDigits, difficulty);
    }
    
    practiceQuestion(operations){
        if (!Array.isArray(operations) || operations.length === 0){
            return null;
        }
        const opChoice = operations[Math.floor(Math.random() * operations.length)];
        
        if (this.difficulty === 'Easy' && opChoice === '÷') {
            return super.generateEasyDivision();
        }
        return super.questionGenerator(opChoice);
    }
}