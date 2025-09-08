import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, MapPin, Briefcase, Users, MessageCircle, ExternalLink, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  current_position: string;
  current_employer: string;
  city: string;
  state: string;
  about_me: string;
  specializations: string[];
  interests: string[];
  site_purposes: string[];
  years_experience: number;
  profile_photo_url: string;
  linkedin_url: string;
  available_for_mentoring: boolean;
  available_for_collaboration: boolean;
}

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['community-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, first_name, last_name, current_position, current_employer,
          city, state, about_me, specializations, interests, site_purposes,
          years_experience, profile_photo_url, linkedin_url,
          available_for_mentoring, available_for_collaboration
        `)
        .eq('is_public', true)
        .neq('user_id', user?.id) // Exclude current user
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
    enabled: !!user,
  });

  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = searchTerm === '' || 
      `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.current_position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.current_employer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPurpose = selectedPurpose === '' ||
      profile.site_purposes?.includes(selectedPurpose);
    
    return matchesSearch && matchesPurpose;
  });

  const purposeOptions = [
    { value: 'networking', label: 'Networking' },
    { value: 'research', label: 'Research' },
    { value: 'mentoring', label: 'Mentoring' },
    { value: 'job_seeking', label: 'Job Opportunities' },
    { value: 'business_development', label: 'Business Dev' },
    { value: 'continuing_education', label: 'Education' },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

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
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">
                PT Community Directory
              </h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Discover PT Professionals</CardTitle>
            <p className="text-muted-foreground">
              Connect with physical therapy professionals in your area and beyond
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, position, employer, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">All Purposes</option>
                {purposeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profiles Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-3/4 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProfiles?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedPurpose 
                  ? 'Try adjusting your search criteria'
                  : 'Be the first to complete your profile and help grow our community!'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles?.map(profile => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={profile.profile_photo_url || undefined} />
                      <AvatarFallback>
                        {getInitials(profile.first_name, profile.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    {profile.current_position && (
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {profile.current_position}
                      </p>
                    )}
                    {profile.current_employer && (
                      <p className="text-sm text-muted-foreground">
                        {profile.current_employer}
                      </p>
                    )}
                    {(profile.city || profile.state) && (
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {[profile.city, profile.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>

                  {profile.about_me && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {profile.about_me}
                    </p>
                  )}

                  {profile.specializations && profile.specializations.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.specializations.slice(0, 3).map(spec => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {profile.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      {profile.available_for_mentoring && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Heart className="h-3 w-3" />
                          Mentoring
                        </Badge>
                      )}
                      {profile.available_for_collaboration && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Users className="h-3 w-3" />
                          Research
                        </Badge>
                      )}
                    </div>
                    {profile.years_experience && (
                      <span className="text-xs text-muted-foreground">
                        {profile.years_experience} yrs exp
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <MessageCircle className="h-3 w-3" />
                      Connect
                    </Button>
                    {profile.linkedin_url && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                        className="gap-1"
                      >
                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Community;