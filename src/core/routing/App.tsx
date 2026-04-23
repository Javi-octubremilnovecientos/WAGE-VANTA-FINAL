import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { routes } from './routes';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setSystemPreference } from '@/features/theme/themeSlice';

const router = createBrowserRouter(routes);

/**
 * Syncs the Redux theme state → document.documentElement class `dark`.
 * Also listens to OS preference changes when mode is 'system'.
 */
function ThemeManager() {
    const dispatch = useAppDispatch();
    const { mode, systemPreference } = useAppSelector((state) => state.theme);

    // Determine effective theme
    const effectiveTheme = mode === 'system' ? systemPreference : mode;

    // Apply dark class to <html>
    useEffect(() => {
        const root = document.documentElement;
        if (effectiveTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [effectiveTheme]);

    // Listen for OS preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            dispatch(setSystemPreference(e.matches ? 'dark' : 'light'));
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [dispatch]);

    return null;
}

function App() {
    return (
        <>
            <ThemeManager />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
