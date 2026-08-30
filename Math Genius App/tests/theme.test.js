import test from 'node:test';
import assert from 'node:assert/strict';
import { getStoredTheme, getDefaultThemePreference, getPreferredTheme, isDarkTheme } from '../website/js/theme.js';

function createStorage() {
    const values = new Map();
    return {
        getItem: key => values.has(key) ? values.get(key) : null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: key => values.delete(key)
    };
}

test.beforeEach(() => {
    globalThis.localStorage = createStorage();
    globalThis.matchMedia = () => ({ matches: false, media: '(prefers-color-scheme: dark)' });
    globalThis.document = {
        body: {
            classList: {
                toggle: () => {},
                contains: () => false
            },
            dataset: {}
        }
    };
});

test('reads a saved theme preference from localStorage', () => {
    localStorage.setItem('math-genius-theme', 'dark');
    assert.equal(getStoredTheme(), 'dark');
});

test('falls back to the system theme when no saved preference exists', () => {
    globalThis.matchMedia = () => ({ matches: true, media: '(prefers-color-scheme: dark)' });
    assert.equal(getDefaultThemePreference(), 'dark');
    assert.equal(getPreferredTheme(), 'dark');
});

test('detects whether a theme is dark', () => {
    assert.equal(isDarkTheme('dark'), true);
    assert.equal(isDarkTheme('light'), false);
});
