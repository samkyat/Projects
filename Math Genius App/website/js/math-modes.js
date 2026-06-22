class MathMode {
    constructor(numOfDigits){
        this.numOfDigits = numOfDigits;
        this.scoreCounter = 0;
        this.questionCounter = 0;
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
            result = num1/num2
            return result.toFixed(2);
        }
        return null;
    }

    questionGenerator(op){
        num1 = this.randomNumberPicker();
        num2 = this.randomNumberPicker();
        ans = this.questionCounter(op, num1, num2);
        return {op, num1, num2, ans};
    }

    summarizeScore(){
        return {scoreCounter:this.scoreCounter, questionCounter: this.questionCounter};
    }

    randomNumberPicker(){
        return Math.floor(Math.random() * (10**this.numOfDigits));
    }
}

class GameMode extends MathMode {
    constructor(numOfDigits){
        super(numOfDigits);
    }

    gameQuestion(){
        operations = ["+", "-", "x", "÷"];
        opChoice = operations[Math.floor(Math.random() * operations.length)];
        return super().question_generator(opChoice);
    }
}

class PracticMode extends MathMode {
    constructor(numOfDigits){
        super(numOfDigits);
    }

    practiceQuestion(operations){
        if (!Array.isArray(operations)){
            return null;
        }
        opChoice = operations[Math.floor(Math.random() * operations.length)];
        return super().question_generator(opChoice);
    }
}