import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const BasicInfoStep = ({ role, data, onChange }: BasicInfoStepProps) => {
  const getCompanySizeOptions = () => {
    if (role === 'physical_therapist') {
      return [
        { value: 'solo', label: 'Solo practice' },
        { value: 'small_clinic', label: 'Small clinic (2-10 staff)' },
        { value: 'medium_clinic', label: 'Medium clinic (11-50 staff)' },
        { value: 'large_clinic', label: 'Large clinic/hospital (50+ staff)' },
        { value: 'not_applicable', label: 'Not applicable' }
      ];
    }
    
    return [
      { value: 'startup', label: 'Startup (1-10 employees)' },
      { value: 'small', label: 'Small (11-50 employees)' },
      { value: 'medium', label: 'Medium (51-200 employees)' },
      { value: 'large', label: 'Large (201-1000 employees)' },
      { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
    ];
  };

  const getExperienceOptions = () => {
    return [
      { value: '0-2', label: '0-2 years' },
      { value: '3-5', label: '3-5 years' },
      { value: '6-10', label: '6-10 years' },
      { value: '11-15', label: '11-15 years' },
      { value: '16-20', label: '16-20 years' },
      { value: '20+', label: '20+ years' }
    ];
  };

  const getCompanyLabel = () => {
    switch (role) {
      case 'pt_owner':
      case 'pt_ceo_coo':
        return 'Practice/Company Name';
      case 'pt_consultant':
        return 'Consulting Company/Practice';
      case 'healthcare_recruiter':
      case 'talent_leadership':
        return 'Company/Agency Name';
      case 'physical_therapist':
        return 'Current Employer (Optional)';
      default:
        return 'Company/Organization Name';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
        <p className="text-muted-foreground mb-6">
          Tell us a bit about your background to help us tailor the questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_name">{getCompanyLabel()}</Label>
          <Input
            id="company_name"
            value={data.company_name}
            onChange={(e) => onChange({ company_name: e.target.value })}
            placeholder="Enter name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_size">
            {role === 'physical_therapist' ? 'Workplace Size' : 'Company Size'}
          </Label>
          <Select value={data.company_size} onValueChange={(value) => onChange({ company_size: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {getCompanySizeOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="years_experience">Years of Experience in Healthcare/PT</Label>
          <Select value={data.years_experience} onValueChange={(value) => onChange({ years_experience: value })}>
            <SelectTrigger className="md:w-1/2">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {getExperienceOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};