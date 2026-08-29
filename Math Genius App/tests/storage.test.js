import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, removeItem, writeJson } from '../website/js/storage.js';

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

test('reads valid JSON objects', () => {
    localStorage.setItem('settings', JSON.stringify({ mode: 'money' }));
    assert.deepEqual(readJson('settings'), { mode: 'money' });
});

test('returns the fallback for missing, malformed, or non-object data', () => {
    const fallback = { safe: true };
    assert.deepEqual(readJson('missing', fallback), fallback);

    localStorage.setItem('malformed', '{');
    assert.deepEqual(readJson('malformed', fallback), fallback);

    localStorage.setItem('array', JSON.stringify(['unexpected']));
    assert.deepEqual(readJson('array', fallback), fallback);
});

test('writes and removes JSON values', () => {
    assert.equal(writeJson('result', { score: 10 }), true);
    assert.deepEqual(readJson('result'), { score: 10 });
    removeItem('result');
    assert.deepEqual(readJson('result'), {});
});
