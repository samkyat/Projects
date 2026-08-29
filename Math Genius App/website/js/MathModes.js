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

export const CANADIAN_DENOMINATIONS = [
    { cents: 5, label: '5¢', type: 'coin' },
    { cents: 10, label: '10¢', type: 'coin' },
    { cents: 25, label: '25¢', type: 'coin' },
    { cents: 100, label: '$1', type: 'coin' },
    { cents: 200, label: '$2', type: 'coin' },
    { cents: 500, label: '$5', type: 'bill' },
    { cents: 1000, label: '$10', type: 'bill' },
    { cents: 2000, label: '$20', type: 'bill' }
];

export const MONEY_OVERCOUNT_BONUS = 1;

export class MoneyMode {
    constructor(maxAmountCents = 2500) {
        this.maxAmountCents = Math.max(5, Math.floor(Number(maxAmountCents) || 2500));
    }

    moneyQuestion() {
        const usableDenominations = CANADIAN_DENOMINATIONS.filter(
            denomination => denomination.cents <= this.maxAmountCents
        );
        const pieces = [];
        const validCombination = [];
        let totalCents = 0;
        const maxPieces = Math.floor(this.maxAmountCents / usableDenominations[0].cents);
        const pieceCount = Math.floor(Math.random() * Math.min(5, maxPieces)) + 1;

        for (let index = 0; index < pieceCount; index += 1) {
            const denomination = usableDenominations[
                Math.floor(Math.random() * usableDenominations.length)
            ];
            pieces.push(denomination.cents);
            validCombination.push(denomination.label);
            totalCents += denomination.cents;
        }

        if (totalCents > this.maxAmountCents) {
            return this.moneyQuestion();
        }

        return {
            type: 'money',
            targetCents: totalCents,
            combinationCount: pieces.length,
            validCombination,
            denominations: CANADIAN_DENOMINATIONS
        };
    }
}