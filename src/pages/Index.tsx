import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">PT Ecosystem</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">
            Physical Therapy Ecosystem Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive mapping and data platform for PTs, companies, schools, and job listings
          </p>
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-foreground">
              🔒 Your platform is now secured with authentication. Ready to start building the mapping features!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
