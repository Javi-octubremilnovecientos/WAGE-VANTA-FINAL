
import AuthModal from '../ui/modals/AuthModal';
import TemplateModal from '../ui/modals/TemplateModal';
import UpgradeModal from '../ui/modals/UpgradeModal';
import type { PremiumFeature } from '../ui/modals/UpgradeModal';
import { useState, useCallback } from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import StandardComboBox, { type SelectOption } from './StandardComboBox';
import NumberInput from './NumberInput';
import StepSlider from './Stepslider';
import { formSteps, DYNAMIC_API_FIELDS, DYNAMIC_FIELDS_ORDER } from '../../features/salaries/salaryConstants';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  selectCurrentStep,
  selectFormValues,
  updateFormValue,
  setCurrentStep,
  setPrimaryCountry,
  clearDownstreamData,
} from '../../features/salaries/salarySlice';
import useDynamicOptions from '../../hooks/useDynamicOptions';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import type { FormFieldId } from '../../features/salaries/types';
import './FormLayout.css';

interface FormLayoutProps {
  onNavigateToSheet?: () => void;
}

/**
 * Componente wrapper para campos ComboBox con carga dinámica.
 * Usa el hook useDynamicOptions para obtener opciones filtradas desde la API.
 */
interface DynamicComboBoxFieldProps {
  field: {
    id: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
  };
  value: string;
  onChange: (fieldId: string, value: string) => void;
}

function DynamicComboBoxField({ field, value, onChange }: DynamicComboBoxFieldProps) {
  const fieldId = field.id as FormFieldId;
  const isDynamic = DYNAMIC_API_FIELDS.has(fieldId);

  // Hook unificado para obtener opciones, loading y enabled
  const { options: dynamicOptions, isLoading, isEnabled } = useDynamicOptions(fieldId);

  // Para campos dinámicos, usar opciones de la API; para estáticos, usar las de formSteps
  const finalOptions: SelectOption[] = isDynamic
    ? dynamicOptions.map((opt) => ({ label: opt, value: opt }))
    : (field.options ?? []);

  return (
    <StandardComboBox
      key={field.id}
      id={field.id}
      label={field.id}
      options={finalOptions}
      placeholder={field.placeholder}
      required={field.required}
      value={value}
      onChange={(newValue) => onChange(field.id, newValue)}
      disabled={!isEnabled}
      loading={isLoading}
    />
  );
}

function FormLayout({ onNavigateToSheet }: FormLayoutProps) {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const formValues = useAppSelector(selectFormValues);
  const { isAuthenticated, canSaveTemplate, maxTemplates } = usePlanLimits();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateModalMode, setTemplateModalMode] = useState<'save' | 'load'>('load');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<PremiumFeature>('save_templates');

  const totalSteps = formSteps.length;
  const currentStepData = formSteps[currentStep];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToSheet?.();
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  /**
   * Maneja el cambio de valor de un campo.
   * Si el campo está en DYNAMIC_FIELDS_ORDER, limpia los campos downstream.
   */
  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    const typedFieldId = fieldId as FormFieldId;

    // Verificar si el campo está en el orden dinámico para limpiar downstream
    if (DYNAMIC_FIELDS_ORDER.includes(typedFieldId)) {
      // Primero limpiamos los campos posteriores antes de actualizar
      dispatch(clearDownstreamData(typedFieldId));
    }

    // Actualizar el valor del campo
    dispatch(updateFormValue({ fieldId, value }));

    // Cuando el usuario selecciona un país en Step 1, reemplazamos el país principal
    if (fieldId === 'Country') {
      dispatch(setPrimaryCountry(value));
    }
  }, [dispatch]);

  const isLastStep = currentStep === totalSteps - 1;

  // Verificar si se puede avanzar al siguiente paso
  // En Step 1: necesita Country seleccionado
  // En otros steps: verificar que todos los campos requeridos del step actual tengan valor
  const isNextDisabled = (() => {
    const currentFields = currentStepData.fields;

    for (const field of currentFields) {
      if (field.required) {
        const value = (formValues as Record<string, string>)[field.id];
        if (!value || value.trim() === '') {
          return true;
        }
      }
    }

    return false;
  })();

  return (
    <div className="w-full max-w-xs md:max-w-lg mx-auto">
      {/* Top Buttons */}


      {/* Step Title */}


      {/* Form */}
      <form action="#" method="POST" className="w-full" onSubmit={handleSubmit}>
        {/* Step Slider */}
        <div className="mb-4">
          <StepSlider currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <div className="flex justify-end h-fit animate-fade-in-down">
          {/* Fill with template button */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-white hover:opacity-80 transition-all duration-200 hover:scale-105 focus:outline-none"
            aria-label="Fill with a template"
            onClick={() => {
              if (!isAuthenticated) {
                setAuthMode('login');
                setAuthModalOpen(true);
              } else {
                setTemplateModalMode('load');
                setTemplateModalOpen(true);
              }
            }}
          >
            <ClipboardDocumentIcon className="w-3 h-3" />
            <span className="text-xs font-medium">Fill with a template</span>
          </button>
        </div>

        {/* Dynamic Fields Container */}
        <div
          key={currentStep}
          className="flex flex-col gap-6 animate-slide-in"
        >
          {currentStepData.fields.map((field) => {
            if (field.type === 'select') {
              return (
                <DynamicComboBoxField
                  key={field.id}
                  field={field}
                  value={(formValues as Record<string, string>)[field.id] || ''}
                  onChange={handleFieldChange}
                />
              );
            }

            if (field.type === 'number') {
              return (
                <NumberInput
                  key={field.id}
                  id={field.id}
                  label={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={(formValues as Record<string, string>)[field.id] || ''}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              );
            }

            return null;
          })}
        </div>


        {/* Save as template button - only on last step */}
        {isLastStep && (
          <div className="flex justify-end animate-fade-in">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                } else if (!canSaveTemplate) {
                  setUpgradeFeature('save_templates');
                  setUpgradeModalOpen(true);
                } else {
                  setTemplateModalMode('save');
                  setTemplateModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <ClipboardDocumentIcon className="h-3.5 w-3.5" />
              Save as Template
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-5 flex gap-2 animate-fade-in-up">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{ backgroundColor: currentStep === 0 ? "#9ca3af" : "#45d2fd" }}
            type="button"
            className="block w-1/3 rounded-md px-2 py-1.5 text-center text-xs font-semibold text-gray-900 shadow-xs hover:opacity-90 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all duration-200 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Back
          </button>
          <button
            onClick={isLastStep ? undefined : handleNext}
            type={isLastStep ? 'submit' : 'button'}
            disabled={isNextDisabled}
            style={{ backgroundColor: isNextDisabled ? "#9ca3af" : "#45d2fd" }}
            className="block w-full rounded-md px-2 py-1.5 text-center text-xs font-semibold text-gray-900 shadow-xs hover:opacity-90 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isLastStep ? 'Go to comprasions sheet' : 'Next'}
          </button>
        </div>
      </form>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={(newMode) => setAuthMode(newMode)}
      />

      <TemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        mode={templateModalMode}
        canSaveTemplate={canSaveTemplate}
        maxTemplates={maxTemplates}
        onUpgradeRequired={() => {
          setTemplateModalOpen(false);
          setUpgradeFeature('save_templates');
          setUpgradeModalOpen(true);
        }}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={upgradeFeature}
      />
    </div>
  );
}

export default FormLayout;
