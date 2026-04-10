import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PlanType = 'FREE' | 'PREMIUM';

interface PlanLimits {
    maxCountries: number;
    maxTemplates: number;
    maxComparisons: number;
    chartViews: 'single' | 'multiple';
    canExport: boolean;
    fullData: boolean;
}

interface PremiumState {
    currentPlan: PlanType;
    limits: PlanLimits;
    usage: {
        countries: number;
        templates: number;
        comparisons: number;
    };
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    FREE: {
        maxCountries: 2,
        maxTemplates: 1,
        maxComparisons: 1,
        chartViews: 'single',
        canExport: false,
        fullData: false,
    },
    PREMIUM: {
        maxCountries: 3,
        maxTemplates: 4,
        maxComparisons: 4,
        chartViews: 'multiple',
        canExport: true,
        fullData: true,
    },
};

const initialState: PremiumState = {
    currentPlan: 'FREE',
    limits: PLAN_LIMITS.FREE,
    usage: {
        countries: 0,
        templates: 0,
        comparisons: 0,
    },
};

const premiumSlice = createSlice({
    name: 'premium',
    initialState,
    reducers: {
        setPlan: (state, action: PayloadAction<PlanType>) => {
            state.currentPlan = action.payload;
            state.limits = PLAN_LIMITS[action.payload];
        },
        updateUsage: (
            state,
            action: PayloadAction<Partial<PremiumState['usage']>>
        ) => {
            state.usage = { ...state.usage, ...action.payload };
        },
        resetUsage: (state) => {
            state.usage = {
                countries: 0,
                templates: 0,
                comparisons: 0,
            };
        },
    },
});

export const { setPlan, updateUsage, resetUsage } = premiumSlice.actions;

export default premiumSlice.reducer;
