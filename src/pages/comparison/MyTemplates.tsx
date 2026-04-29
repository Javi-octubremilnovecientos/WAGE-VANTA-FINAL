import { ArrowLeftIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { selectUserTemplates } from '@/features/auth/authSlice';
import { setFormValues, setPrimaryCountry } from '@/features/salaries/salarySlice';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useUpdateUserData } from '@/hooks/useUpdateUserData';
import PlanLimitBadge from '@/components/ui/PlanLimitBadge';
import TemplateStack from '@/components/ui/TemplateStack';
import type { Template } from '@/lib/User';

function MyTemplates() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const templates = useAppSelector(selectUserTemplates);
    const { maxTemplates } = usePlanLimits();
    const updateUserData = useUpdateUserData();
    const hasTemplates = templates && templates.length > 0;

    const handleDeleteTemplate = async (templateId: number) => {
        try {
            const updatedTemplates = templates.filter((t) => t.id !== templateId);

            // Actualizar en Supabase y Redux (preserva todos los campos de user_metadata)
            await updateUserData({ templates: updatedTemplates });
        } catch (err) {
            console.error('Error deleting template:', err);
        }
    };

    const handleTemplateClick = (template: Template) => {
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

        // Navegar a Home para ver el chart
        navigate('/');
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96969F] hover:text-[#D84124] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col gap-2 sm:gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                            My Templates
                        </h1>
                        <PlanLimitBadge
                            current={templates.length}
                            max={maxTemplates}
                            label="Templates"
                            showWhenZero
                        />
                    </div>
                    <p className="text-sm font-medium text-[#96969F]">
                        Your saved comparison templates for quick setup
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {!hasTemplates && (
                <section>
                    <div className="rounded-lg border border-white/10 bg-[#121213]/40 backdrop-blur px-4 py-14 text-center shadow-lg sm:px-6">
                        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                            <div className="inline-flex rounded-full bg-[#D84124]/20 p-2 text-[#D84124]">
                                <DocumentTextIcon className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-medium text-[#96969F]">
                                No templates saved yet
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D84124] transition-colors hover:text-[#ED8B34] mt-1"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Create template
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Templates Stack */}
            {hasTemplates && (
                <section className="w-full">
                    <TemplateStack
                        templates={templates}
                        onTemplateClick={handleTemplateClick}
                        onTemplateDelete={handleDeleteTemplate}
                    />
                </section>
            )}
        </div>
    );
}

export default MyTemplates;
