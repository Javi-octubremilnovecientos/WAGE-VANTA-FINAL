/**
 * Salary Comparison Form Constants
 * 
 * Este archivo contiene todas las constantes utilizadas en el formulario de comparación salarial:
 * - Opciones de países
 * - Opciones de ocupaciones/profesiones
 * - Niveles de experiencia
 * - Labels de campos del formulario
 * - Configuración de pasos del wizard
 */

import type { FormFieldId } from './types';

/**
 * Orden de campos para carga dinámica progresiva.
 * Cada campo depende de todos los anteriores para filtrar sus opciones.
 * Los campos NO incluidos aquí (Monthly Wage, Years Of Experience, Company Size)
 * son inputs del usuario, no columnas filtrables de TABLE_0.
 */
export const DYNAMIC_FIELDS_ORDER: FormFieldId[] = [
    'Country',           // idx 0 - estático (base de toda query)
    'Gender',            // idx 1 - estático
    'Economic Activity', // idx 2 - dinámico, depende de [0,1]
    'Occupation',        // idx 3 - dinámico, depende de [0,1,2]
    'Occupation Level',  // idx 4 - dinámico, depende de [0,1,2,3]
    'Education Level',   // idx 5 - dinámico, depende de [0,1,2,3,4]
];

/** Campos con opciones estáticas (hardcodeadas en formSteps) */
export const STATIC_FIELDS = new Set<FormFieldId>([
    'Country',
    'Gender',
    'Years Of Experience',
    'Company Size',
]);

/** Campos que se cargan dinámicamente desde la API */
export const DYNAMIC_API_FIELDS = new Set<FormFieldId>([
    'Economic Activity',
    'Occupation',
    'Occupation Level',
    'Education Level',
]);

export const formSteps = [
    {
        stepNumber: 1,
        fields: [
            {
                id: "Country",
                type: "select",
                placeholder: "Choose a country",
                required: true,
                options: [
                    { label: "Belgium", value: "Belgium" },
                    { label: "Bulgaria", value: "Bulgaria" },

                    { label: "Cyprus", value: "Cyprus" },

                    { label: "Denmark", value: "Denmark" },

                    { label: "France", value: "France" },

                    { label: "Greece", value: "Greece" },

                    { label: "Italy", value: "Italy" },

                    { label: "Netherlands", value: "Netherlands" },
                    { label: "Portugal", value: "Portugal" },

                    { label: "Spain", value: "Spain" },

                    { label: "United Kingdom", value: "United Kingdom" },
                ],
            },
            {
                id: "Gender",
                type: "select",
                required: true,
                options: [
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" }

                ],
            },
            {
                id: "Monthly Wage",
                type: "number",
                required: true,
                placeholder: "Enter your monthly wage",
            },
        ],
    },
    {
        stepNumber: 2,
        fields: [
            {
                id: "Economic Activity",
                type: "select",
                placeholder: "Choose an economic activity",
                required: true,
                // Opciones cargadas dinámicamente desde API según Country + Gender
                options: [],
            },
            {
                id: "Occupation",
                type: "select",
                placeholder: "Choose an occupation",
                required: true,
                // Opciones cargadas dinámicamente desde API según filtros previos
                options: [],
            },
            {
                id: "Occupation Level",
                type: "select",
                placeholder: "Choose an occupation level",
                required: true,
                // Opciones cargadas dinámicamente desde API según filtros previos
                options: [],
            },
        ],
    },
    {
        stepNumber: 3,
        fields: [
            {
                id: "Education Level",
                type: "select",
                required: true,
                placeholder: "Choose an education level",
                // Opciones cargadas dinámicamente desde API según filtros previos
                options: [],
            },
            {
                id: "Years Of Experience",
                type: "select",
                required: true,
                options: [
                    { label: "Less than 1 year", value: "Less than 1 year" },
                    { label: "1-2 years", value: "1-2 years" },
                    { label: "3-5 years", value: "3-5 years" },
                    { label: "6-10 years", value: "6-10 years" },
                    { label: "11-15 years", value: "11-15 years" },
                    { label: "16-20 years", value: "16-20 years" },
                    { label: "More than 20 years", value: "More than 20 years" },
                ],
            },
            {
                id: "Company Size",
                type: "select",
                required: true,
                options: [
                    { label: "1-10 employees", value: "1-10 employees" },
                    { label: "11-50 employees", value: "11-50 employees" },
                    { label: "51-200 employees", value: "51-200 employees" },
                    { label: "201-500 employees", value: "201-500 employees" },
                    { label: "501-1000 employees", value: "501-1000 employees" },
                    { label: "1001-5000 employees", value: "1001-5000 employees" },
                    { label: "More than 5000 employees", value: "More than 5000 employees" },
                ],
            },
        ],
    },
];

/** Países válidos derivados de las opciones del formulario */
const countryField = formSteps
    .flatMap((step) => step.fields)
    .find((field) => field.id === 'Country');

export const VALID_COUNTRIES = new Set(
    (countryField?.options ?? []).map((option: { value: string }) => option.value),
);


