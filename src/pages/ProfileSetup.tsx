import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EnhancedProfileForm from '@/components/community/EnhancedProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user already has a complete profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    // If user already has a complete profile, redirect to dashboard
    if (profile && profile.first_name && profile.last_name && profile.about_me) {
      navigate('/');
    }
  }, [profile, navigate]);

  if (!user) {
    return null;
  }

  const handleProfileComplete = () => {
    navigate('/');
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Complete Your Profile
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Help other PT professionals discover and connect with you by completing your profile. 
              This helps us personalize your experience and show you relevant opportunities.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Progress value={33} className="w-48" />
              <span className="text-sm text-muted-foreground">Step 1 of 3</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Welcome to the PT Professional Network!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                You're joining a community of physical therapy professionals dedicated to advancing 
                our field through networking, research, and collaboration. Let's set up your profile 
                so others can discover your expertise and interests.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  className="gap-2"
                >
                  Skip for now
                </Button>
                <div className="text-sm text-muted-foreground self-center">
                  You can complete this later from your profile settings
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <EnhancedProfileForm onComplete={handleProfileComplete} />
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;