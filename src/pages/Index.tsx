import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';
import ProfileCompletionBanner from '@/components/ProfileCompletionBanner';
import { User, Users, Settings } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-elegant">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center shadow-premium">
                <svg viewBox="0 0 32 32" className="w-7 h-7 text-white">
                  <path fill="currentColor" d="M16 2L8 8v6c0 7.18 4.82 13.94 12 15.5 7.18-1.56 12-8.32 12-15.5V8l-8-6zm4 18h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V8h8v4z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background"></div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">PT Ecosystem</h1>
              <p className="text-sm text-muted-foreground font-medium">Professional Healthcare Network</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/about')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/pricing')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Button>
              <span className="text-xs font-medium text-accent px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                Beta Platform
              </span>
            </nav>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm font-medium text-foreground block">
                  {user.email?.split('@')[0]}
                </span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/community')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Community
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/profile')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              
              <Button variant="outline" onClick={signOut} className="shadow-soft">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="animate-fade-in">
          <ProfileCompletionBanner />
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
