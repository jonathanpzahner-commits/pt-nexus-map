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
              {/* Network Connection Symbol */}
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                {/* Connection lines */}
                <path 
                  d="M8 12 L20 8 L32 12 M8 28 L20 32 L32 28 M12 20 L28 20" 
                  stroke="url(#gradient1)" 
                  strokeWidth="2" 
                  fill="none"
                  className="animate-pulse"
                />
                {/* Network nodes */}
                <circle cx="8" cy="12" r="3" fill="hsl(215 84% 35%)" />
                <circle cx="20" cy="8" r="3" fill="hsl(180 84% 55%)" />
                <circle cx="32" cy="12" r="3" fill="hsl(215 84% 35%)" />
                <circle cx="8" cy="28" r="3" fill="hsl(180 84% 55%)" />
                <circle cx="20" cy="32" r="3" fill="hsl(215 84% 35%)" />
                <circle cx="32" cy="28" r="3" fill="hsl(180 84% 55%)" />
                <circle cx="12" cy="20" r="2.5" fill="hsl(215 84% 50%)" />
                <circle cx="28" cy="20" r="2.5" fill="hsl(215 84% 50%)" />
                
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(215 84% 35%)" />
                    <stop offset="100%" stopColor="hsl(180 84% 55%)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                PT<span className="italic font-light text-accent">Eco</span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-accent font-semibold tracking-wide">Making the PT community feel a little smaller</p>
                <span className="text-xs text-muted-foreground/70">•</span>
                <p className="text-xs text-muted-foreground/90 font-medium">A Henry Holland Health Company</p>
              </div>
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
      <main className="max-w-4xl mx-auto p-8">
        <div className="animate-fade-in prose prose-lg max-w-none">
          <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-lg p-8 shadow-elegant">
            <h1 className="text-3xl font-bold text-foreground mb-6">PT Ecosystem Platform</h1>
            
            <div className="text-foreground/90 leading-relaxed space-y-4">
              <p className="text-lg">
                The unified market-intelligence and community layer for physical therapy — a comprehensive platform that maps every company, clinic, consultant, and clinician in the ecosystem.
              </p>
              
              <p>
                Our platform consolidates fragmented job boards, continuing education registries, and company data into one searchable, API-ready knowledge graph, while adding a social hub for Reddit-style discussions, mentorship programs, professional groups, research collaboration, industry events, and a vetted consultant marketplace.
              </p>
              
              <div className="my-6">
                <h2 className="text-xl font-semibold text-foreground mb-3">Value Proposition by Stakeholder</h2>
                
                <div className="space-y-3">
                  <p><strong>Recruiters & Operators:</strong> Hire and expand faster with comprehensive talent mapping and direct access to verified professionals.</p>
                  
                  <p><strong>Consultants:</strong> Win more work through verified expertise profiles and direct client connections.</p>
                  
                  <p><strong>Clinicians:</strong> Discover career opportunities, find mentors, and access continuing education that matches their specialization.</p>
                  
                  <p><strong>Students:</strong> Find PT schools that match their budget, location preferences, and career goals.</p>
                  
                  <p><strong>Companies:</strong> License comprehensive market data or integrate via plugins to power business development, recruiting strategies, and education targeting.</p>
                </div>
              </div>
              
              <div className="my-6">
                <h2 className="text-xl font-semibold text-foreground mb-3">Market Opportunity</h2>
                <p>
                  Physical therapy is a $40B+ market with highly fragmented data sources. Our platform creates the first comprehensive ecosystem map, enabling data-driven decisions across hiring, business development, education, and professional networking.
                </p>
              </div>
              
              <div className="my-6">
                <h2 className="text-xl font-semibold text-foreground mb-3">Revenue Streams</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Data licensing to healthcare companies and PE firms</li>
                  <li>API subscriptions for recruitment and business development tools</li>
                  <li>Premium community memberships</li>
                  <li>Consultant marketplace transaction fees</li>
                  <li>Targeted advertising for education and career services</li>
                </ul>
              </div>
              
              <p className="text-lg font-medium text-foreground">
                We're building the definitive platform where the entire PT ecosystem connects, collaborates, and grows together.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
