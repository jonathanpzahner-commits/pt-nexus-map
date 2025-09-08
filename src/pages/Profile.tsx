import { useAuth } from '@/hooks/useAuth';
import EnhancedProfileForm from '@/components/community/EnhancedProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <User className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">
                Profile Settings
              </h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Professional Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete your profile to connect with other PT professionals, showcase your expertise, 
                and participate in the community. Your public profile helps others find and connect with you 
                based on your specializations and interests.
              </p>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <EnhancedProfileForm onComplete={() => {
            // Optional: Navigate somewhere after completion or show success message
          }} />
        </div>
      </main>
    </div>
  );
};

export default Profile;