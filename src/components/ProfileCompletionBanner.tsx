import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ProfileCompletionBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile-completion', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, about_me, site_purposes, specializations')
        .eq('user_id', user.id)
        .single();
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Don't show if dismissed, user not logged in, or profile is complete
  if (dismissed || !user || !profile) return null;
  
  const isIncomplete = !profile.first_name || 
                      !profile.last_name || 
                      !profile.about_me ||
                      !profile.site_purposes?.length ||
                      !profile.specializations?.length;

  if (!isIncomplete) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Complete Your Professional Profile
              </h3>
              <p className="text-sm text-muted-foreground">
                Help other PT professionals discover you by completing your profile setup
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/profile/setup')}
              className="gap-2"
            >
              Complete Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionBanner;