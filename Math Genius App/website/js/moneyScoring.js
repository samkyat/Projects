import { MONEY_OVERCOUNT_BONUS } from './MathModes.js';

export function evaluateMoneyAnswer(question, answer) {
    const amountIsCorrect = answer.totalCents === question.targetCents;
    const countIsEnough = answer.pieceCount >= question.combinationCount;
    const isCorrect = amountIsCorrect && countIsEnough;
    const earnedBonus = isCorrect && answer.pieceCount > question.combinationCount;

    return {
        isCorrect,
        earnedBonus,
        points: isCorrect ? 10 + (earnedBonus ? MONEY_OVERCOUNT_BONUS : 0) : -5
    };
}
