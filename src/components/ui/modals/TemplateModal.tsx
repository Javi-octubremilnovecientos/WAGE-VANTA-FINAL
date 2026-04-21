import { useState } from 'react';
import { DocumentTextIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { selectUserTemplates, updateTemplates } from '@/features/auth/authSlice';
import { selectFormValues, setFormValues, setPrimaryCountry } from '@/features/salaries/salarySlice';
import { useUpdateUserMutation } from '@/features/auth/authApi';
import type { Template } from '@/lib/User';
import PlanLimitBadge from '../PlanLimitBadge';
import TemplateStack from '../TemplateStack';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Modo 'save' para guardar template actual, 'load' para cargar un template existente */
    mode: 'save' | 'load';
    /** Si el usuario puede guardar templates (validación de plan) */
    canSaveTemplate: boolean;
    /** Máximo número de templates permitidos según el plan */
    maxTemplates: number;
    /** Callback para mostrar modal de upgrade si alcanza límite */
    onUpgradeRequired: () => void;
}

/**
 * Modal para guardar y cargar templates de formulario.
 * 
 * **Modo 'save':**
 * - Convierte formValues actual en un Template
 * - Valida límite según plan (Guest: 0, FREE: 1, Premium: 4)
 * - Sincroniza con Supabase usando updateUser mutation
 * 
 * **Modo 'load':**
 * - Lista templates guardados del usuario
 * - Al seleccionar, llena el formulario con los valores del template
 * 
 * @example
 * ```tsx
 * <TemplateModal
 *   isOpen={templateModalOpen}
 *   onClose={() => setTemplateModalOpen(false)}
 *   mode="save"
 *   canSaveTemplate={canSaveTemplate}
 *   maxTemplates={maxTemplates}
 *   onUpgradeRequired={() => setUpgradeModalOpen(true)}
 * />
 * ```
 */
function TemplateModal({
    isOpen,
    onClose,
    mode,
    canSaveTemplate,
    maxTemplates,
    onUpgradeRequired,
}: TemplateModalProps) {
    const dispatch = useAppDispatch();
    const templates = useAppSelector(selectUserTemplates);
    const formValues = useAppSelector(selectFormValues);
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSaveTemplate = async () => {
        if (!canSaveTemplate) {
            onClose();
            onUpgradeRequired();
            return;
        }

        try {
            setError(null);

            // Crear nuevo template desde formValues
            const newTemplate: Template = {
                id: Date.now(), // ID único basado en timestamp
                country: formValues.Country || '',
                gender: formValues.Gender || '',
                monthlyWage: parseFloat(formValues['Monthly Wage'] || '0'),
                economicActivity: formValues['Economic Activity'],
                occupation: formValues.Occupation,
                position: formValues['Occupation Level'],
                educationLevel: formValues['Education Level'],
                companySize: formValues['Company Size'],
                experienceYears: formValues['Years Of Experience']
                    ? parseInt(formValues['Years Of Experience'])
                    : undefined,
            };

            // Agregar al array de templates
            const updatedTemplates = [...templates, newTemplate];

            // Actualizar en Redux
            dispatch(updateTemplates(updatedTemplates));

            // Sincronizar con Supabase
            await updateUser({
                data: { templates: updatedTemplates },
            }).unwrap();

            onClose();
        } catch (err) {
            console.error('Error saving template:', err);
            setError('Failed to save template. Please try again.');
        }
    };

    const handleLoadTemplate = (template: Template) => {
        // Convertir Template a ComparisonFormValues
        const loadedValues = {
            Country: template.country,
            Gender: template.gender,
            'Monthly Wage': template.monthlyWage.toString(),
            'Economic Activity': template.economicActivity || '',
            Occupation: template.occupation || '',
            'Occupation Level': template.position || '',
            'Education Level': template.educationLevel || '',
            'Company Size': template.companySize || '',
            'Years Of Experience': template.experienceYears?.toString() || '',
        };

        // Actualizar formulario
        dispatch(setFormValues(loadedValues));

        // También actualizar el país primario para que se muestre el chart
        if (template.country) {
            dispatch(setPrimaryCountry(template.country));
        }

        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-modal-title"
        >
            <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg p-5 shadow-xl">
                {/* Title */}
                <h2
                    id="template-modal-title"
                    className="text-lg font-bold mb-3 text-white flex items-center gap-2"
                >
                    <DocumentTextIcon className="h-5 w-5 text-[#45d2fd]" />
                    {mode === 'save' ? 'Save Template' : 'Load Template'}
                </h2>

                {/* Badge de límite */}
                <div className="mb-4">
                    <PlanLimitBadge
                        current={templates.length}
                        max={maxTemplates}
                        label="Templates"
                        onUpgradeClick={mode === 'save' && !canSaveTemplate ? onUpgradeRequired : undefined}
                        showWhenZero
                    />
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 rounded-md bg-red-500/10 border border-red-600/50 p-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* Modo SAVE */}
                {mode === 'save' ? (
                    <div className="space-y-4">
                        {!canSaveTemplate ? (
                            /* Mensaje de límite alcanzado */
                            <div className="rounded-lg border border-yellow-600/50 bg-yellow-500/10 p-4">
                                <div className="flex items-start gap-3">
                                    <SparklesIcon className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-yellow-300 mb-1">
                                            Template limit reached
                                        </p>
                                        <p className="text-xs text-yellow-200/80">
                                            You've reached the maximum number of templates for your plan.
                                            Upgrade to Premium to save up to 4 templates.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Confirmación de guardado */
                            <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-4">
                                <p className="text-sm text-gray-300 mb-3">
                                    Save current form values as a template for quick reuse.
                                </p>
                                <div className="space-y-1 text-xs text-gray-400">
                                    <p>• Country: {formValues.Country || 'Not set'}</p>
                                    <p>• Gender: {formValues.Gender || 'Not set'}</p>
                                    <p>• Monthly Wage: {formValues['Monthly Wage'] || 'Not set'}</p>
                                </div>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-2">
                            {canSaveTemplate ? (
                                <button
                                    onClick={handleSaveTemplate}
                                    disabled={isLoading}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white bg-[#45D2FD] hover:bg-[#22b8d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#45D2FD] focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    <CheckCircleIcon className="h-4 w-4" />
                                    {isLoading ? 'Saving...' : 'Save Template'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        onClose();
                                        onUpgradeRequired();
                                    }}
                                    className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-white bg-[#45D2FD] hover:bg-[#22b8d9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#45D2FD] focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    Upgrade to Premium
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Modo LOAD */
                    <div className="space-y-4">
                        {templates.length === 0 ? (
                            /* Empty state */
                            <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-8 text-center">
                                <DocumentTextIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No templates saved yet</p>
                            </div>
                        ) : (
                            /* Stack de templates con pestañas */
                            <TemplateStack
                                templates={templates}
                                onTemplateClick={handleLoadTemplate}
                            />
                        )}

                        {/* Botón de cerrar */}
                        <button
                            onClick={onClose}
                            className="w-full rounded-md px-3 py-2 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TemplateModal;
