import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { ChallengesStep } from './steps/ChallengesStep';
import { ToolsAndPricingStep } from './steps/ToolsAndPricingStep';
import { FeaturesStep } from './steps/FeaturesStep';
import { BetaInterestStep } from './steps/BetaInterestStep';

interface SurveyFormProps {
  role: string;
  onSubmit: (data: any) => void;
}

export const SurveyForm = ({ role, onSubmit }: SurveyFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    company_name: '',
    company_size: '',
    years_experience: '',
    current_challenges: [] as string[],
    pain_point_severity: {},
    tools_currently_used: [] as string[],
    pricing_willingness: '',
    feature_priorities: {},
    beta_interest: false,
    contact_email: '',
    contact_name: '',
    additional_comments: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            role={role}
            data={formData}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <ChallengesStep 
            role={role}
            data={formData}
            onChange={updateFormData}
          />
        );
      case 3:
        return (
          <ToolsAndPricingStep 
            role={role}
            data={formData}
            onChange={updateFormData}
          />
        );
      case 4:
        return (
          <FeaturesStep 
            role={role}
            data={formData}
            onChange={updateFormData}
          />
        );
      case 5:
        return (
          <BetaInterestStep 
            role={role}
            data={formData}
            onChange={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep === totalSteps ? (
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Submit Survey
          </Button>
        ) : (
          <Button onClick={nextStep}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};