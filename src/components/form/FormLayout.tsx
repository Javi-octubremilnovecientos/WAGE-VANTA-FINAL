
import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  selectCurrentStep,
  selectFormValues,
  updateFormValue,
  setCurrentStep,
  setPrimaryCountry,
} from '../../features/salaries/salarySlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import AuthModal from '../ui/modals/AuthModal';
import TemplateModal from '../ui/modals/TemplateModal';
import UpgradeModal from '../ui/modals/UpgradeModal';
import { ClipboardDocumentIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import StandardComboBox from './StandardComboBox';
import NumberInput from './NumberInput';
import StepSlider from './Stepslider';
import { formSteps } from '../../features/salaries/salaryConstants';
import { useDynamicOptions } from '../../hooks/useDynamicOptions';
import { usePlanLimits } from '../../hooks/usePlanLimits';
import type { FormFieldId } from '../../features/salaries/types';
import './FormLayout.css';

interface FormLayoutProps {
  onNavigateToSheet?: () => void;
}

/**
 * Subcomponente para campos con opciones dinámicas.
 * Debe existir como componente separado para que el hook useDynamicOptions
 * se pueda llamar en el nivel de componente correcto (no dentro de un loop).
 */
interface DynamicComboFieldProps {
  fieldId: FormFieldId;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

function DynamicComboField({ fieldId, placeholder, value, onChange }: DynamicComboFieldProps) {
  const { options, isLoading, isEnabled } = useDynamicOptions(fieldId);

  const selectOptions = options.map((opt) => ({ label: opt, value: opt }));

  return (
    <StandardComboBox
      id={fieldId}
      label={fieldId}
      options={selectOptions}
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
      disabled={!isEnabled}
      loading={isLoading && isEnabled}
    />
  );
}

function FormLayout({ onNavigateToSheet }: FormLayoutProps) {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const formValues = useAppSelector(selectFormValues);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { canSaveTemplate, maxTemplates } = usePlanLimits();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateMode, setTemplateMode] = useState<'save' | 'load'>('load');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  const totalSteps = formSteps.length;
  const currentStepData = formSteps[currentStep];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToSheet?.();
  };

  const handleNext = () => {
    // Blur SOLO el NumberInput (si existe) para triggear commit
    const numberInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (numberInput) {
      numberInput.blur();
    }

    if (currentStep < totalSteps - 1) {
      dispatch(setCurrentStep(currentStep + 1));
      setEditingValues({}); // Limpiar valores siendo editados al cambiar de paso
    }
  };

  const handleBack = () => {
    // Blur SOLO el NumberInput (si existe) para triggear commit
    const numberInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (numberInput) {
      numberInput.blur();
    }

    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
      setEditingValues({}); // Limpiar valores siendo editados al cambiar de paso
    }
  };

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    dispatch(updateFormValue({ fieldId, value }));

    // Cuando el usuario selecciona un país en Step 1, lo añadimos/actualizamos
    if (fieldId === 'Country') {
      dispatch(setPrimaryCountry(value));
    }
  }, [dispatch]);

  /**
   * Handler para cambios en tiempo real mientras se escribe (NumberInput).
   * Actualiza estado local para habilitar/deshabilitar botones en tiempo real.
   */
  const handleInputChange = useCallback((fieldId: string, value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  const isLastStep = currentStep === totalSteps - 1;

  // Verificar si se puede avanzar al siguiente paso
  // Verificar que todos los campos requeridos del step actual tengan valor
  // Chequea TANTO formValues (Redux) como editingValues (siendo editados)
  const isNextDisabled = (() => {
    const currentFields = currentStepData.fields;

    for (const field of currentFields) {
      if (field.required) {
        // Primer chequeo: valor en Redux
        let value = (formValues as Record<string, string>)[field.id];

        // Segundo chequeo: valor siendo editado (para NumberInput en tiempo real)
        if (!value || value.trim() === '') {
          value = editingValues[field.id];
        }

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
            className="flex items-center  gap-1.5 text-gray-700 dark:text-white hover:opacity-80 transition-all duration-200 hover:scale-105 focus:outline-none"
            aria-label="Fill with a template"
            onClick={() => {
              if (isAuthenticated) {
                setTemplateMode('load');
                setTemplateModalOpen(true);
              } else {
                setAuthMode('login');
                setAuthModalOpen(true);
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
            if (field.type === 'select' && field.options) {
              // Campos con opciones dinámicas (vacías en formSteps): usar DynamicComboField
              if (field.options.length === 0) {
                return (
                  <DynamicComboField
                    key={field.id}
                    fieldId={field.id as FormFieldId}
                    placeholder={field.placeholder}
                    value={(formValues as Record<string, string>)[field.id] || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                  />
                );
              }

              // Campos con opciones estáticas (Country, Gender, etc.)
              return (
                <StandardComboBox
                  key={field.id}
                  id={field.id}
                  label={field.id}
                  options={field.options}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={(formValues as Record<string, string>)[field.id] || ''}
                  onChange={(value) => handleFieldChange(field.id, value)}
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
                  onInputChange={(value) => handleInputChange(field.id, value)}
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
              className="flex items-center gap-1 text-gray-700 dark:text-white hover:opacity-80 transition-all duration-200 hover:scale-105 focus:outline-none h-fit mt-1.5"
              aria-label="Save as a template"
              onClick={() => {
                if (isAuthenticated) {
                  setTemplateMode('save');
                  setTemplateModalOpen(true);
                } else {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }
              }}
            >
              <BookmarkIcon className="w-3 h-3" />
              <span className="text-xs font-medium">Save as a template</span>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={(newMode) => setAuthMode(newMode)}
      />

      {/* Template Modal */}
      <TemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        mode={templateMode}
        canSaveTemplate={canSaveTemplate}
        maxTemplates={maxTemplates}
        onUpgradeRequired={() => setUpgradeModalOpen(true)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature="save_templates"
      />
    </div>
  );
}

export default FormLayout;
