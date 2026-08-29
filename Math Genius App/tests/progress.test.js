import test from 'node:test';
import assert from 'node:assert/strict';
import { getProgress, PROGRESS_KEY, recordSession, resetProgress } from '../website/js/progress.js';

function createStorage() {
    const values = new Map();
    return {
        getItem: key => values.has(key) ? values.get(key) : null,
        setItem: (key, value) => values.set(key, value),
        removeItem: key => values.delete(key)
    };
}

test.beforeEach(() => {
    globalThis.localStorage = createStorage();
});

test('records sessions and updates totals', () => {
    recordSession({
        mode: 'money-practice',
        score: 21,
        correctAnswers: 2,
        incorrectAnswers: 1,
        bonusPoints: 1,
        bestStreak: 2
    });

    const progress = getProgress();
    assert.equal(progress.sessions.length, 1);
    assert.deepEqual(progress.totals, {
        sessions: 1,
        questions: 3,
        correct: 2,
        incorrect: 1,
        bonusPoints: 1,
        bestStreak: 2
    });
});

test('unlocks achievements from cumulative progress', () => {
    recordSession({ mode: 'money', score: 100, correctAnswers: 10, incorrectAnswers: 0, bonusPoints: 5, bestStreak: 10 });
    const achievements = getProgress().achievements;

    assert.ok(achievements.includes('first-session'));
    assert.ok(achievements.includes('ten-correct'));
    assert.ok(achievements.includes('five-bonus-points'));
    assert.ok(achievements.includes('ten-question-streak'));
    assert.ok(achievements.includes('ninety-percent-accuracy'));
});

test('resets saved progress', () => {
    recordSession({ mode: 'game', score: 10, correctAnswers: 1, incorrectAnswers: 0 });
    resetProgress();
    assert.deepEqual(getProgress().totals.sessions, 0);
    assert.equal(JSON.parse(localStorage.getItem(PROGRESS_KEY)).sessions.length, 0);
});
