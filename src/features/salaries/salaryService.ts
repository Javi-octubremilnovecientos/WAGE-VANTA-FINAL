export interface SalaryData {
    country: string;
    gender: string;
    monthlyWage: number;
    economicActivity: string;
    occupation: string;
    position: string;
    educationLevel?: string;
    companySize?: string;
    experienceYears?: number;
}

export interface SalaryStats {
    min: number;
    max: number;
    median: number;
    q1: number;
    q3: number;
    mean: number;
}

export const salaryService = {
    fetchSalaryData: async (params: Partial<SalaryData>): Promise<SalaryStats> => {
        // TODO: Implement actual API call to statistical database
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock data for development
                resolve({
                    min: 25000,
                    max: 75000,
                    median: 45000,
                    q1: 35000,
                    q3: 55000,
                    mean: 47500,
                });
            }, 1000);
        });
    },

    compareSalaries: async (
        countries: string[]
    ): Promise<Record<string, SalaryStats>> => {
        // TODO: Implement actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const result: Record<string, SalaryStats> = {};
                countries.forEach((country) => {
                    result[country] = {
                        min: Math.random() * 20000 + 20000,
                        max: Math.random() * 30000 + 60000,
                        median: Math.random() * 20000 + 40000,
                        q1: Math.random() * 10000 + 30000,
                        q3: Math.random() * 10000 + 50000,
                        mean: Math.random() * 20000 + 42000,
                    };
                });
                resolve(result);
            }, 1500);
        });
    },
};
