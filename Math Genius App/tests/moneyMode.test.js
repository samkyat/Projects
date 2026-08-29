import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CANADIAN_DENOMINATIONS,
    MoneyMode,
    MONEY_OVERCOUNT_BONUS
} from '../website/js/MathModes.js';
import { evaluateMoneyAnswer } from '../website/js/moneyScoring.js';

const levelLimits = [2500, 5000, 10000];

test('uses the common Canadian denomination set', () => {
    assert.deepEqual(
        CANADIAN_DENOMINATIONS.map(denomination => denomination.cents),
        [5, 10, 25, 100, 200, 500, 1000, 2000]
    );
});

test('generates reachable questions within each level limit', () => {
    for (const limit of levelLimits) {
        const mode = new MoneyMode(limit);
        for (let index = 0; index < 100; index += 1) {
            const question = mode.moneyQuestion();
            assert.ok(question.targetCents >= 5);
            assert.ok(question.targetCents <= limit);
            assert.equal(question.validCombination.length, question.combinationCount);
        }
    }
});

test('difficulty controls piece complexity and available denominations', () => {
    const beginner = new MoneyMode(2500, 'beginner').moneyQuestion();
    const intermediate = new MoneyMode(5000, 'intermediate').moneyQuestion();
    const pro = new MoneyMode(10000, 'pro').moneyQuestion();

    assert.ok(beginner.combinationCount <= 3);
    assert.ok(beginner.denominations.every(denomination => denomination.cents <= 200));
    assert.ok(intermediate.combinationCount >= 2 && intermediate.combinationCount <= 5);
    assert.ok(intermediate.denominations.every(denomination => denomination.cents <= 1000));
    assert.ok(pro.combinationCount >= 3 && pro.combinationCount <= 7);
    assert.equal(pro.denominations.at(-1).cents, 2000);
});

test('filters generated denominations by the selected money type', () => {
    const coinsOnly = new MoneyMode(2500, 'beginner', ['coin']).moneyQuestion();
    const billsOnly = new MoneyMode(2500, 'beginner', ['bill']).moneyQuestion();

    assert.ok(coinsOnly.denominations.every(denomination => denomination.type === 'coin'));
    assert.ok(billsOnly.denominations.every(denomination => denomination.type === 'bill'));
});

test('awards normal points for an exact-count answer', () => {
    const result = evaluateMoneyAnswer(
        { targetCents: 125, combinationCount: 2 },
        { totalCents: 125, pieceCount: 2 }
    );

    assert.deepEqual(result, { isCorrect: true, earnedBonus: false, points: 10 });
});

test('awards a bonus for a correct over-count answer', () => {
    const result = evaluateMoneyAnswer(
        { targetCents: 125, combinationCount: 2 },
        { totalCents: 125, pieceCount: 3 }
    );

    assert.equal(result.isCorrect, true);
    assert.equal(result.earnedBonus, true);
    assert.equal(result.points, 10 + MONEY_OVERCOUNT_BONUS);
});

test('rejects a correct amount with too few pieces', () => {
    const result = evaluateMoneyAnswer(
        { targetCents: 125, combinationCount: 2 },
        { totalCents: 125, pieceCount: 1 }
    );

    assert.deepEqual(result, { isCorrect: false, earnedBonus: false, points: -5 });
});

test('rejects an incorrect total even when the piece count is enough', () => {
    const result = evaluateMoneyAnswer(
        { targetCents: 125, combinationCount: 2 },
        { totalCents: 120, pieceCount: 3 }
    );

    assert.equal(result.isCorrect, false);
    assert.equal(result.earnedBonus, false);
});
