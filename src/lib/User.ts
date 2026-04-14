interface Template {
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

interface ChartData {
  min: number;
  max: number;
  median: number;
  q1: number;
  q3: number;
  mean: number;
  mw: number;
}

interface SurveyYear extends ChartData {
  year: number;
}

interface Comprasion {
  id: number;
  median: ChartData;
  history: SurveyYear[];
}

interface cardData {
  cardNumber: number;
  cardName: string;
  expires: Date;
}

type payState = "refused" | "pending" | "done";

interface paymentCharge {
  id: number;
  cardFourDigits: number;
  state: payState;
  chargeDate: Date;
}

interface User {
  email: string;
  password: string;
  data: {
    name: string;
    premium: boolean;
    templates: Template[];
    compraisons: Comprasion[];
    payData: {
      card: cardData;
      history: paymentCharge[];
    };
  };
}
