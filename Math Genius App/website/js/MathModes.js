export class MathMode {
    constructor(range){
        const min = Number(range?.min || 1);
        const max = Number(range?.max || 10);
        this.min = Math.min(min, max);
        this.max = Math.max(min, max);
    }

    questionSolver(op, num1, num2) {
        switch (op) {
            case "+": return num1 + num2;
            case "-": return num1 - num2;
            case "x": return num1 * num2;
            case "÷":
                const result = num1 / num2;
                return result % 1 === 0 ? result : Math.round(result * 100) / 100;
            default: return null;
        }
    }

    questionGenerator(op){
        const num1 = this.randomNumberPicker();
        const num2 = op === "÷" ? this.randomNonZeroPicker() : this.randomNumberPicker();
        const ans = this.questionSolver(op, num1, num2);
        return {op, num1, num2, ans};
    }

    randomNumberPicker(){
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }

    randomNonZeroPicker(){
        let value;
        do {
            value = this.randomNumberPicker();
        } while (value === 0);
        return value;
    }

    generateEasyDivision() {
        const num2 = this.randomNonZeroPicker();
        const maxQuotient = Math.floor(this.max / num2);
        const ans = Math.floor(Math.random() * maxQuotient) + 1;
        return { op: '÷', num1: num2 * ans, num2, ans };
    }
}

export class GameMode extends MathMode {
    constructor(range){
        super(range);
    }

    gameQuestion(){
        const operations = ["+", "-", "x", "÷"];
        const opChoice = operations[Math.floor(Math.random() * operations.length)];
        
        if (opChoice === '÷') {
            return super.generateEasyDivision();
        }
        return super.questionGenerator(opChoice);
    }
}
export class PracticeMode extends MathMode {
    constructor(range){
        super(range);
    }
    
    practiceQuestion(operations){
        if (!Array.isArray(operations) || operations.length === 0){
            return null;
        }
        const opChoice = operations[Math.floor(Math.random() * operations.length)];
        
        if (opChoice === '÷') {
            return super.generateEasyDivision();
        }
        return super.questionGenerator(opChoice);
    }
}