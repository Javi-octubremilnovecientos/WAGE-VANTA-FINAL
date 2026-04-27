import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    systemPreference: 'light' | 'dark';
}

const initialState: ThemeState = {
    mode: 'system',
    systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
        },
        setSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.systemPreference = action.payload;
        },
        toggleTheme: (state) => {
            if (state.mode === 'light') {
                state.mode = 'dark';
            } else {
                // Si está en 'dark' o 'system', siempre pasa a 'light' o 'dark' respectivamente
                state.mode = 'light';
            }
        },
    },
});

export const { setTheme, setSystemPreference, toggleTheme } =
    themeSlice.actions;

// Selector para obtener el tema efectivo (considerando system preference)
export const selectEffectiveTheme = (state: { theme: ThemeState }) => {
    if (state.theme.mode === 'system') {
        return state.theme.systemPreference;
    }
    return state.theme.mode;
};

export default themeSlice.reducer;
