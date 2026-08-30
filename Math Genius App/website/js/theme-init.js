(() => {
    const getStoredTheme = () => {
        try {
            const stored = localStorage.getItem('math-genius-theme');
            return stored === 'dark' || stored === 'light' ? stored : null;
        } catch {
            return null;
        }
    };

    const applyTheme = (isDark) => {
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark-theme', isDark);
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;

        if (document.body) {
            document.body.classList.toggle('dark-theme', isDark);
            document.body.dataset.theme = theme;
            document.body.style.color = isDark ? '#e2e8f0' : '#102a43';
            document.body.style.background = isDark
                ? 'radial-gradient(circle at top, #0f172a 0%, #020817 52%, #020617 100%)'
                : 'radial-gradient(circle at top, #f0f7ff 0%, #dbeafe 32%, #e2e8f0 100%)';
        }
    };

    const setInitialTheme = () => {
        try {
            const savedTheme = getStoredTheme();
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
            applyTheme(isDark);
        } catch {
            applyTheme(false);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setInitialTheme, { once: true });
        return;
    }

    setInitialTheme();
})();
