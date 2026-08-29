import { readJson, writeJson } from './storage.js';

export const PROGRESS_KEY = 'mathGeniusProgress';
export const PROGRESS_VERSION = 1;

function emptyProgress() {
    return {
        version: PROGRESS_VERSION,
        sessions: [],
        totals: {
            sessions: 0,
            questions: 0,
            correct: 0,
            incorrect: 0,
            bonusPoints: 0,
            bestStreak: 0
        },
        achievements: []
    };
}

export function getProgress() {
    const stored = readJson(PROGRESS_KEY, emptyProgress());
    const progress = emptyProgress();
    progress.sessions = Array.isArray(stored.sessions) ? stored.sessions : [];
    progress.totals = { ...progress.totals, ...(stored.totals || {}) };
    progress.achievements = Array.isArray(stored.achievements) ? stored.achievements : [];
    return progress;
}

export function recordSession(result) {
    const progress = getProgress();
    const correct = Number(result.correctAnswers) || 0;
    const incorrect = Number(result.incorrectAnswers) || 0;
    const bonusPoints = Number(result.bonusPoints) || 0;
    const bestStreak = Number(result.bestStreak) || 0;
    const session = {
        mode: result.mode || 'unknown',
        score: Number(result.score) || 0,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        bonusPoints,
        bestStreak,
        date: new Date().toISOString()
    };

    progress.sessions.push(session);
    progress.totals.sessions += 1;
    progress.totals.questions += correct + incorrect;
    progress.totals.correct += correct;
    progress.totals.incorrect += incorrect;
    progress.totals.bonusPoints += bonusPoints;
    progress.totals.bestStreak = Math.max(progress.totals.bestStreak, bestStreak);
    progress.achievements = updateAchievements(progress);
    writeJson(PROGRESS_KEY, progress);
    return progress;
}

function updateAchievements(progress) {
    const achievements = new Set(progress.achievements);
    const { sessions, questions, correct, bonusPoints, bestStreak } = progress.totals;
    if (sessions >= 1) achievements.add('first-session');
    if (correct >= 10) achievements.add('ten-correct');
    if (bonusPoints >= 5) achievements.add('five-bonus-points');
    if (bestStreak >= 10) achievements.add('ten-question-streak');
    if (questions > 0 && correct / questions >= 0.9) achievements.add('ninety-percent-accuracy');
    return [...achievements];
}

export function resetProgress() {
    return writeJson(PROGRESS_KEY, emptyProgress());
}
