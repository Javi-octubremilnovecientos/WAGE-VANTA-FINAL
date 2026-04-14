export interface Template {
  id: number;
  country: string;
  gender: string;
  monthlyWage: number;
  economicActivity?: string;
  occupation?: string;
  position?: string;
  educationLevel?: string;
  companySize?: string;
  experienceYears?: number;
}

export interface ChartData {
  min: number;
  max: number;
  median: number;
  q1: number;
  q3: number;
  mean: number;
  mw: number;
}

export interface SurveyYear extends ChartData {
  year: number;
}

export interface Comparison {
  id: number;
  median: ChartData;
  history: SurveyYear[];
}

export interface CardData {
  cardNumber: string;
  cardName: string;
  expires: string;
}

export type PayState = 'refused' | 'pending' | 'done';

export interface PaymentCharge {
  id: number;
  cardFourDigits: string;
  state: PayState;
  chargeDate: string;
}

export interface PayData {
  card: CardData | null;
  history: PaymentCharge[];
}

export interface UserData {
  name: string;
  premium: boolean;
  templates: Template[];
  comparisons: Comparison[];
  payData: PayData;
}

export function createDefaultUserData(name: string): UserData {
  return {
    name,
    premium: false,
    templates: [],
    comparisons: [],
    payData: {
      card: null,
      history: [],
    },
  };
}
