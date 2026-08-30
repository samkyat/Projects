export const THEME_KEY = 'math-genius-theme';

function getStorage() {
    const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
    try {
        if (!storage || typeof storage.getItem !== 'function') return null;
        return storage;
    } catch {
        return null;
    }
}

export function getStoredTheme() {
    const storage = getStorage();
    if (!storage) return null;

    const theme = storage.getItem(THEME_KEY);
    return theme === 'dark' || theme === 'light' ? theme : null;
}

export function setStoredTheme(theme) {
    const storage = getStorage();
    if (!storage) return false;

    const safeTheme = theme === 'dark' ? 'dark' : 'light';
    storage.setItem(THEME_KEY, safeTheme);
    return true;
}

export function getDefaultThemePreference() {
    const mediaMatcher = typeof window !== 'undefined' ? window.matchMedia : globalThis.matchMedia;
    if (typeof mediaMatcher !== 'function') {
        return 'light';
    }

    return mediaMatcher('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getPreferredTheme() {
    return getStoredTheme() ?? getDefaultThemePreference();
}

export function isDarkTheme(theme) {
    return theme === 'dark';
}

export function applyTheme(theme) {
    const safeTheme = isDarkTheme(theme) ? 'dark' : 'light';
    const palette = safeTheme === 'dark'
        ? {
            text: '#e2e8f0',
            background: 'radial-gradient(circle at top, #0f172a 0%, #020817 52%, #020617 100%)'
        }
        : {
            text: '#102a43',
            background: 'radial-gradient(circle at top, #f0f7ff 0%, #dbeafe 32%, #e2e8f0 100%)'
        };

    if (document.documentElement) {
        document.documentElement.classList.toggle('dark-theme', safeTheme === 'dark');
        document.documentElement.dataset.theme = safeTheme;
        document.documentElement.style.colorScheme = safeTheme;
    }

    if (document.body) {
        document.body.classList.toggle('dark-theme', safeTheme === 'dark');
        document.body.dataset.theme = safeTheme;
        document.body.style.color = palette.text;
        document.body.style.background = palette.background;
    }

    return safeTheme;
}

export function updateThemeButton(button) {
    if (!button) return;

    const currentTheme = getPreferredTheme();
    const isDark = isDarkTheme(currentTheme);

    button.textContent = isDark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('aria-pressed', String(isDark));
    button.dataset.theme = currentTheme;
}

export function initializeTheme(button) {
    const applyPreferredTheme = () => {
        const preferredTheme = getPreferredTheme();
        applyTheme(preferredTheme);

        if (!button) {
            return preferredTheme;
        }

        updateThemeButton(button);
        button.addEventListener('click', () => {
            const nextTheme = document.body && document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            setStoredTheme(nextTheme);
            applyTheme(nextTheme);
            updateThemeButton(button);
        });

        return preferredTheme;
    };

    if (typeof document !== 'undefined' && document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPreferredTheme, { once: true });
        return 'light';
    }

    return applyPreferredTheme();
}

if (typeof document !== 'undefined') {
    const toggleButton = document.getElementById('themeToggle');
    initializeTheme(toggleButton);
}
