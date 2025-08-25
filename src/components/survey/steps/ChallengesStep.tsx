import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface ChallengesStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const ChallengesStep = ({ role, data, onChange }: ChallengesStepProps) => {
  const getChallenges = () => {
    const commonChallenges = [
      'Finding qualified staff',
      'Managing multiple vendor relationships',
      'Tracking industry contacts and relationships',
      'Staying updated on industry trends',
      'Networking with other professionals'
    ];

    const roleChallenges: Record<string, string[]> = {
      pt_owner: [
        'Staff recruitment and retention',
        'Equipment procurement and maintenance',
        'Practice management efficiency',
        'Financial management and growth',
        'Competition analysis',
        ...commonChallenges
      ],
      pt_ceo_coo: [
        'Strategic planning and growth',
        'Multi-location management',
        'Technology integration',
        'Performance analytics',
        'Regulatory compliance',
        ...commonChallenges
      ],
      pt_consultant: [
        'Finding new clients',
        'Market research and analysis',
        'Professional development',
        'Building credibility',
        'Managing client relationships',
        ...commonChallenges
      ],
      healthcare_recruiter: [
        'Finding qualified PT candidates',
        'Understanding client needs',
        'Market salary benchmarking',
        'Candidate relationship management',
        'Competition from other recruiters',
        ...commonChallenges
      ],
      talent_leadership: [
        'Talent pipeline development',
        'Retention strategies',
        'Compensation benchmarking',
        'Skills gap analysis',
        'Succession planning',
        ...commonChallenges
      ],
      physical_therapist: [
        'Career advancement opportunities',
        'Continuing education options',
        'Job search and opportunities',
        'Professional networking',
        'Staying current with best practices',
        ...commonChallenges
      ]
    };

    return roleChallenges[role] || commonChallenges;
  };

  const handleChallengeToggle = (challenge: string, checked: boolean) => {
    const newChallenges = checked 
      ? [...data.current_challenges, challenge]
      : data.current_challenges.filter((c: string) => c !== challenge);
    
    onChange({ current_challenges: newChallenges });
  };

  const handleSeverityChange = (challenge: string, severity: number[]) => {
    onChange({
      pain_point_severity: {
        ...data.pain_point_severity,
        [challenge]: severity[0]
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Challenges</h2>
        <p className="text-muted-foreground mb-6">
          What are your biggest challenges in your current role? Select all that apply and rate their severity.
        </p>
      </div>

      <div className="space-y-4">
        {getChallenges().map((challenge) => {
          const isSelected = data.current_challenges.includes(challenge);
          const severity = data.pain_point_severity[challenge] || 3;

          return (
            <Card key={challenge} className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={challenge}
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleChallengeToggle(challenge, checked as boolean)
                    }
                  />
                  <Label htmlFor={challenge} className="flex-1 cursor-pointer">
                    {challenge}
                  </Label>
                </div>

                {isSelected && (
                  <div className="ml-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Impact Level:</span>
                      <span className="font-medium">
                        {severity <= 2 ? 'Low' : severity <= 4 ? 'Medium' : 'High'}
                      </span>
                    </div>
                    <Slider
                      value={[severity]}
                      onValueChange={(value) => handleSeverityChange(challenge, value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minor issue</span>
                      <span>Critical issue</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};