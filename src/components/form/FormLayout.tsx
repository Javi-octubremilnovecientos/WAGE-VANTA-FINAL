
import { useState } from 'react';
import AuthModal from '../ui/modals/AuthModal';
import { ClipboardDocumentIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import StandardComboBox from './StandardComboBox';
import NumberInput from './NumberInput';
import StepSlider from './Stepslider';
import { formSteps } from '../../features/salaries/salaryConstants';
import './FormLayout.css';

// Type for form values
type FormValues = Record<string, string>;

interface FormLayoutProps {
  onCountryChange?: (value: string) => void;
}

function FormLayout({ onCountryChange }: FormLayoutProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});

  const [authModalOpen, setAuthModalOpen] = useState(false);
const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const totalSteps = formSteps.length;
  const currentStepData = formSteps[currentStep];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formValues);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    if (fieldId === 'country') {
      onCountryChange?.(value);
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const isNextDisabled = currentStep === 0 && !formValues['country'];

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
            onClick={() => setAuthModalOpen(true)}
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
              return (
                <StandardComboBox
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  options={field.options}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formValues[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              );
            }

            if (field.type === 'number') {
              return (
                <NumberInput
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formValues[field.id] || ''}
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
              className="flex items-center gap-1 text-white hover:opacity-80 transition-all duration-200 hover:scale-105 focus:outline-none h-fit mt-1.5"
              aria-label="Save as a template"
              onClick={() => setAuthModalOpen(true)}
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
  mode={authMode}  // ← usar el estado en vez de hardcodear
  onSwitchMode={(newMode) => setAuthMode(newMode)}  // ← permitir cambio
/>
    </div>
  );
}

export default FormLayout;
