import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

interface ToolsAndPricingStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const ToolsAndPricingStep = ({ role, data, onChange }: ToolsAndPricingStepProps) => {
  const getTools = () => {
    const roleTools: Record<string, string[]> = {
      pt_owner: [
        'Practice management software (WebPT, TheraOffice, etc.)',
        'Excel/Google Sheets for vendor tracking',
        'LinkedIn for networking and recruiting',
        'Email and phone for vendor communications',
        'Industry publications (APTA, state association newsletters)',
        'Local PT owner networking groups',
        'Referral tracking spreadsheets',
        'Manual vendor price comparison',
        'Word-of-mouth recommendations from peers',
        'Google searches for equipment and services',
        'Trade show vendor lists',
        'None - I handle everything manually'
      ],
      pt_ceo_coo: [
        'Business intelligence dashboards (Tableau, Power BI)',
        'Multi-location practice management systems',
        'Excel/Google Sheets for performance tracking',
        'CRM software for relationship management',
        'LinkedIn for industry networking',
        'Industry benchmarking reports (purchased)',
        'Consultant relationships for market insights',
        'Private equity network connections',
        'Board advisor relationships',
        'Industry conference networking',
        'Professional association memberships',
        'None - I rely on internal teams for data'
      ],
      pt_consultant: [
        'CRM software for client relationship management',
        'LinkedIn for prospecting and networking',
        'Industry research subscriptions',
        'Excel/Google Sheets for analysis',
        'Survey tools (SurveyMonkey, Typeform)',
        'Professional association memberships',
        'Conference networking and speaking',
        'Referral networks from past clients',
        'Cold outreach via email and LinkedIn',
        'Content marketing (blog, LinkedIn posts)',
        'Direct mail and targeted advertising',
        'None - I rely primarily on referrals'
      ],
      healthcare_recruiter: [
        'Applicant tracking system (ATS)',
        'LinkedIn Recruiter for candidate sourcing',
        'Job boards (Indeed, ZipRecruiter, PT-specific)',
        'CRM for client relationship management',
        'Salary survey data and reports',
        'Professional association job boards',
        'Referral networks and past placements',
        'Cold calling and networking',
        'Social media recruiting (Facebook, Instagram)',
        'PT school career fair participation',
        'Employee referral programs',
        'None - I use basic tools and networking'
      ],
      talent_leadership: [
        'HRIS system for talent management',
        'LinkedIn for sourcing and employer branding',
        'Salary benchmarking tools (PayScale, Glassdoor)',
        'Performance management software',
        'Learning management system (LMS)',
        'Employee engagement survey tools',
        'Applicant tracking system (ATS)',
        'PT school partnership programs',
        'Professional development budget tracking',
        'Succession planning software',
        'Industry compensation surveys',
        'None - I use manual processes and spreadsheets'
      ],
      physical_therapist: [
        'LinkedIn for networking and job searching',
        'Indeed, ZipRecruiter for job opportunities',
        'Continuing education platforms (MedBridge, etc.)',
        'Professional association websites (APTA)',
        'PT-specific job boards',
        'Networking through current colleagues',
        'Professional mentorship relationships',
        'Specialty-specific online communities',
        'Conference networking and education',
        'Local PT networking groups',
        'Social media groups (Facebook, Reddit)',
        'None - I rely on word-of-mouth and referrals'
      ]
    };

    return roleTools[role] || [];
  };

  const getPricingOptions = () => {
    const baseOptions = [
      { value: 'free', label: 'Free only' },
      { value: 'under_50', label: 'Under $50/month' },
      { value: '50_100', label: '$50-100/month' },
      { value: '100_250', label: '$100-250/month' },
      { value: '250_500', label: '$250-500/month' },
      { value: 'over_500', label: 'Over $500/month' },
      { value: 'not_interested', label: 'Not interested in paid solutions' }
    ];

    if (role === 'physical_therapist') {
      return [
        { value: 'free', label: 'Free only' },
        { value: 'under_25', label: 'Under $25/month' },
        { value: '25_50', label: '$25-50/month' },
        { value: '50_100', label: '$50-100/month' },
        { value: 'over_100', label: 'Over $100/month' },
        { value: 'not_interested', label: 'Not interested in paid solutions' }
      ];
    }

    return baseOptions;
  };

  const handleToolToggle = (tool: string, checked: boolean) => {
    const newTools = checked 
      ? [...data.tools_currently_used, tool]
      : data.tools_currently_used.filter((t: string) => t !== tool);
    
    onChange({ tools_currently_used: newTools });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Solutions & Investment</h2>
        <p className="text-muted-foreground mb-6">
          Understanding what you currently use and what you'd invest in helps us build the right solution.
        </p>
      </div>

      {/* Current Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How do you currently handle these challenges?</h3>
        <p className="text-sm text-muted-foreground">Check all tools, methods, and resources you currently use</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getTools().map((tool) => (
            <div key={tool} className="flex items-center space-x-3">
              <Checkbox
                id={tool}
                checked={data.tools_currently_used.includes(tool)}
                onCheckedChange={(checked) => 
                  handleToolToggle(tool, checked as boolean)
                }
              />
              <Label htmlFor={tool} className="cursor-pointer">
                {tool}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            What would you pay monthly for a platform that significantly reduces these challenges?
          </h3>
          <p className="text-sm text-muted-foreground">
            Consider a comprehensive solution that saves you 5-10 hours per week and improves your results.
          </p>
          
          <RadioGroup
            value={data.pricing_willingness}
            onValueChange={(value) => onChange({ pricing_willingness: value })}
            className="space-y-3"
          >
            {getPricingOptions().map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>
    </div>
  );
};