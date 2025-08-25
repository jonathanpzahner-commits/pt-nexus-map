import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SurveyHeader } from '@/components/survey/SurveyHeader';
import { SurveyForm } from '@/components/survey/SurveyForm';
import { SurveyThankYou } from '@/components/survey/SurveyThankYou';
import { Card } from '@/components/ui/card';

const Survey = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  // Track page view analytics
  useEffect(() => {
    if (role) {
      trackAnalytics(role, 'page_view');
    }
  }, [role]);

  const trackAnalytics = async (respondentRole: string, event: string, timeSpent?: number) => {
    try {
      await supabase.from('survey_analytics').insert({
        respondent_role: respondentRole,
        page_views: event === 'page_view' ? 1 : 0,
        time_spent_seconds: timeSpent || 0,
        source_campaign: new URLSearchParams(window.location.search).get('utm_source') || 'direct'
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const handleSurveySubmit = async (data: any) => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    try {
      const { error } = await supabase.from('survey_responses').insert({
        ...data,
        respondent_role: role
      });

      if (error) throw error;

      // Track completion analytics
      if (role) {
        await trackAnalytics(role, 'completion', timeSpent);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Survey submission error:', error);
    }
  };

  // Validate role parameter
  const validRoles = ['pt_owner', 'pt_ceo_coo', 'pt_consultant', 'healthcare_recruiter', 'talent_leadership', 'physical_therapist'];
  
  if (!role || !validRoles.includes(role)) {
    navigate('/survey/pt_owner');
    return null;
  }

  if (isSubmitted) {
    return <SurveyThankYou role={role} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <SurveyHeader role={role} />
          
          <Card className="mt-8 p-8">
            <SurveyForm role={role} onSubmit={handleSurveySubmit} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Survey;