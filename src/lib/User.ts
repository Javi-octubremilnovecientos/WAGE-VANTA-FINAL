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

/**
 * Snapshot de BoxPlot serializable para persistir en Redux/storage.
 * Replica la shape de BoxPlotData (features/salaries/types) sin importarla
 * para evitar dependencias circulares desde lib/.
 */
export interface SavedBoxPlotEntry {
  category: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  color?: string;
}

/**
 * Snapshot de los valores del formulario guardados junto a la comparación.
 * Réplica de ComparisonFormValues para mantener lib/ libre de dependencias de features/.
 */
export interface SavedFormValues {
  Country?: string;
  Gender?: string;
  'Monthly Wage'?: string;
  'Economic Activity'?: string;
  Occupation?: string;
  'Occupation Level'?: string;
  'Education Level'?: string;
  'Years Of Experience'?: string;
  'Company Size'?: string;
}

/**
 * Comparison guardada por el usuario.
 * Contiene todos los datos necesarios para volver a renderizar un ComparisonSheet
 * sin necesidad de re-fetchear la API.
 */
export interface Comparison {
  id: number;
  savedAt: string;                  // ISO date string
  selectedCountries: string[];      // Países comparados
  formValues: SavedFormValues;      // Filtros del formulario
  computedStats: SavedBoxPlotEntry[]; // BoxPlot stats por país
  userWage?: number | null;         // Salario de referencia del usuario
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
