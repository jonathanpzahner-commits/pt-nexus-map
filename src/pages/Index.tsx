import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';
import { User, Settings } from 'lucide-react';

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
      {/* Modern Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">PT</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">PT Ecosystem</h1>
              <p className="text-xs text-muted-foreground">A Henry Holland Health Company</p>
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
              <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-secondary/50">
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
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
