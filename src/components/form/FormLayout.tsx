
import { useState } from 'react';
import StandardComboBox from './StandardComboBox';
import NumberInput from './NumberInput';
import StepSlider from './Stepslider';
import { formSteps } from '../../features/salaries/salaryConstants';

// Type for form values
type FormValues = Record<string, string>;

function FormLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});

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
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="w-full max-w-md md:max-w-2xl mx-auto">
      {/* Step Slider */}
      <div className="mb-8">
        <StepSlider currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Step Title */}
      <h2 className="text-xl font-semibold text-white mb-6">
        {currentStepData.title}
      </h2>

      {/* Form */}
      <form action="#" method="POST" className="w-full" onSubmit={handleSubmit}>
        {/* Dynamic Fields Container */}
        <div className="flex flex-col gap-6">
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

        {/* Navigation Buttons */}
        <div className="mt-10 flex gap-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{ backgroundColor: currentStep === 0 ? "#9ca3af" : "#45d2fd" }}
            type="button"
            className="block w-1/3 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={isLastStep ? undefined : handleNext}
            type={isLastStep ? 'submit' : 'button'}
            style={{ backgroundColor: "#45d2fd" }}
            className="block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
          >
            {isLastStep ? 'Submit' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormLayout;
