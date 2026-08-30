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
export function getPracticeProgress(currentIndex, questionCount) {
    const safeQuestionCount = Math.max(1, Math.round(Number(questionCount) || 1));
    const safeCurrentIndex = Math.max(0, Math.round(Number(currentIndex) || 0));
    const clampedIndex = Math.min(safeCurrentIndex, safeQuestionCount);

    return {
        currentQuestionNumber: Math.min(clampedIndex + 1, safeQuestionCount),
        isFinished: safeCurrentIndex >= safeQuestionCount
    };
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

export const MONEY_DIFFICULTIES = {
    beginner: { maxPieces: 3, minPieces: 1, maxDenominationCents: 200 },
    intermediate: { maxPieces: 5, minPieces: 2, maxDenominationCents: 1000 },
    pro: { maxPieces: 7, minPieces: 3, maxDenominationCents: 2000 }
};

export class MoneyMode {
    constructor(maxAmountCents = 2500, difficulty = 'beginner', allowedTypes = ['coin', 'bill']) {
        this.maxAmountCents = Math.max(5, Math.floor(Number(maxAmountCents) || 2500));
        this.difficulty = MONEY_DIFFICULTIES[difficulty] || MONEY_DIFFICULTIES.beginner;
        this.allowedTypes = Array.isArray(allowedTypes) && allowedTypes.length > 0
            ? allowedTypes
            : ['coin', 'bill'];
    }

    moneyQuestion() {
        const scopedDenominations = CANADIAN_DENOMINATIONS.filter(
            denomination => this.allowedTypes.includes(denomination.type)
        );
        const usableDenominations = scopedDenominations.filter(
            denomination => denomination.cents <= this.maxAmountCents
                && denomination.cents <= this.difficulty.maxDenominationCents
        );
        const availableDenominations = usableDenominations.length > 0
            ? usableDenominations
            : scopedDenominations.filter(denomination => denomination.cents <= this.maxAmountCents);
        const maxPieces = Math.min(
            this.difficulty.maxPieces,
            Math.floor(this.maxAmountCents / availableDenominations[0].cents)
        );
        const minPieces = Math.min(this.difficulty.minPieces, maxPieces);

        for (let attempt = 0; attempt < 100; attempt += 1) {
            const pieceCount = Math.floor(Math.random() * (maxPieces - minPieces + 1)) + minPieces;
            const pieces = [];
            let totalCents = 0;

            for (let index = 0; index < pieceCount; index += 1) {
                const denomination = availableDenominations[
                    Math.floor(Math.random() * availableDenominations.length)
                ];
                pieces.push(denomination);
                totalCents += denomination.cents;
            }

            if (totalCents <= this.maxAmountCents) {
                return {
                    type: 'money',
                    targetCents: totalCents,
                    combinationCount: pieces.length,
                    validCombination: pieces.map(denomination => denomination.label),
                    denominations: availableDenominations
                };
            }
        }

        return {
            type: 'money',
            targetCents: availableDenominations[0].cents,
            combinationCount: 1,
            validCombination: [availableDenominations[0].label],
            denominations: availableDenominations
        };
    }
}