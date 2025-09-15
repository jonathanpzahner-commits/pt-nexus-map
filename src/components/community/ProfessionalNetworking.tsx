import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useConnections } from '@/hooks/useConnections';
import { 
  Network, 
  UserPlus, 
  MessageCircle, 
  Search,
  Users,
  UserCheck,
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  ChevronDown
} from 'lucide-react';

interface PTProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  current_position?: string;
  current_employer?: string;
  profile_photo_url?: string;
  city?: string;
  state?: string;
  specializations?: string[];
  professional_categories?: string[];
  about_me?: string;
  years_experience?: number;
  education?: string[];
  certifications?: string[];
}

const PROFESSIONAL_CATEGORIES = [
  'Physical Therapist',
  'Physical Therapist Assistant',
  'Professor/Faculty',
  'Student',
  'Business Owner',
  'Consultant',
  'Management Firm Executive',
  'Clinic Owner',
  'Clinical Executive',
  'Talent Agency',
  'Corporate Talent',
  'Human Resources',
  'Director of Clinical Education (DCE)',
  'Clinic Management',
  'Clinical Regional Management',
  'CEO',
  'CFO',
  'COO',
  'CHRO',
  'Talent Management',
  'Talent Executive',
  'Continuing Education Provider',
  'Course Instructor',
  'Education Technology',
  'Research Scientist',
  'Clinical Researcher',
  'Healthcare Technology',
  'Medical Equipment Specialist'
];

// Fake professional data for demonstration
const FAKE_PROFESSIONALS: PTProfile[] = [
  {
    user_id: 'fake-1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    current_position: 'Senior Physical Therapist',
    current_employer: 'Elite Sports Rehabilitation',
    city: 'Los Angeles',
    state: 'CA',
    professional_categories: ['Physical Therapist'],
    specializations: ['Sports Medicine', 'Orthopedics'],
    about_me: 'Passionate about helping athletes return to peak performance through evidence-based treatment approaches.',
    years_experience: 8,
    education: ['DPT - USC', 'BS Kinesiology - UCLA'],
    certifications: ['OCS', 'SCS']
  },
  {
    user_id: 'fake-2',
    first_name: 'Michael',
    last_name: 'Chen',
    current_position: 'Director of Clinical Education',
    current_employer: 'University of Health Sciences',
    city: 'Boston',
    state: 'MA',
    professional_categories: ['Professor/Faculty', 'Director of Clinical Education (DCE)'],
    specializations: ['Neurological Rehabilitation', 'Research'],
    about_me: 'Dedicated to advancing PT education and research in neurological conditions.',
    years_experience: 15,
    education: ['PhD Physical Therapy - Harvard', 'DPT - Northeastern'],
    certifications: ['NCS', 'PCS']
  },
  {
    user_id: 'fake-3',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    current_position: 'Physical Therapist Assistant',
    current_employer: 'Community Health Center',
    city: 'Phoenix',
    state: 'AZ',
    professional_categories: ['Physical Therapist Assistant'],
    specializations: ['Geriatrics', 'Balance Training'],
    about_me: 'Committed to improving quality of life for elderly patients through comprehensive rehabilitation.',
    years_experience: 5,
    education: ['AS Physical Therapist Assistant - Phoenix College'],
    certifications: ['CPR', 'First Aid']
  },
  {
    user_id: 'fake-4',
    first_name: 'David',
    last_name: 'Thompson',
    current_position: 'CEO',
    current_employer: 'TherapyWorks Group',
    city: 'Dallas',
    state: 'TX',
    professional_categories: ['CEO', 'Business Owner', 'Clinic Owner'],
    specializations: ['Healthcare Management', 'Business Development'],
    about_me: 'Leading a network of 25+ PT clinics with focus on patient outcomes and staff development.',
    years_experience: 20,
    education: ['MBA - Wharton', 'DPT - UT Southwestern'],
    certifications: ['Healthcare Executive']
  },
  {
    user_id: 'fake-5',
    first_name: 'Jessica',
    last_name: 'Park',
    current_position: 'PT Student (3rd Year)',
    current_employer: 'State University DPT Program',
    city: 'Seattle',
    state: 'WA',
    professional_categories: ['Student'],
    specializations: ['Pediatrics Interest', 'Community Health'],
    about_me: 'DPT student passionate about pediatric therapy and community outreach programs.',
    years_experience: 0,
    education: ['BS Exercise Science - UW (In Progress DPT)'],
    certifications: ['CPR']
  },
  {
    user_id: 'fake-6',
    first_name: 'Robert',
    last_name: 'Williams',
    current_position: 'VP of Talent Acquisition',
    current_employer: 'HealthStaff Solutions',
    city: 'Atlanta',
    state: 'GA',
    professional_categories: ['Corporate Talent', 'Talent Executive'],
    specializations: ['Healthcare Recruitment', 'Talent Strategy'],
    about_me: 'Specializing in connecting top PT talent with leading healthcare organizations nationwide.',
    years_experience: 12,
    education: ['MBA - Emory', 'BS Business - Georgia Tech'],
    certifications: ['SHRM-CP', 'Healthcare Recruiter Certified']
  },
  {
    user_id: 'fake-7',
    first_name: 'Amanda',
    last_name: 'Foster',
    current_position: 'Continuing Education Director',
    current_employer: 'PT Education Institute',
    city: 'Denver',
    state: 'CO',
    professional_categories: ['Continuing Education Provider', 'Course Instructor'],
    specializations: ['Manual Therapy', 'Course Development'],
    about_me: 'Developing innovative continuing education programs for practicing physical therapists.',
    years_experience: 18,
    education: ['DPT - University of Colorado', 'MS Education'],
    certifications: ['MTC', 'FAAOMPT']
  },
  {
    user_id: 'fake-8',
    first_name: 'Christopher',
    last_name: 'Lee',
    current_position: 'Clinical Research Manager',
    current_employer: 'Rehab Research Institute',
    city: 'Chicago',
    state: 'IL',
    professional_categories: ['Clinical Researcher', 'Research Scientist'],
    specializations: ['Outcomes Research', 'Clinical Trials'],
    about_me: 'Leading clinical trials to advance evidence-based practice in physical therapy.',
    years_experience: 10,
    education: ['PhD Rehabilitation Science - Northwestern', 'DPT - UIC'],
    certifications: ['Clinical Research Coordinator']
  }
];

export const ProfessionalNetworking = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('discover');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const {
    pendingRequests,
    sentRequests,
    acceptedConnections,
    sendConnectionRequest,
    respondToConnection,
    isSendingRequest,
    isResponding
  } = useConnections();

  // Filter fake professionals based on search and category
  const filteredProfessionals = FAKE_PROFESSIONALS.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.current_employer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.current_position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      profile.professional_categories?.includes(selectedCategory);
      
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (receiverId: string) => {
    sendConnectionRequest(receiverId);
  };

  const handleAccept = (connectionId: string) => {
    respondToConnection({ connectionId, status: 'accepted' });
  };

  const handleDecline = (connectionId: string) => {
    respondToConnection({ connectionId, status: 'declined' });
  };

  const isConnectionRequested = (profileId: string) => {
    return sentRequests.some(req => req.receiver_id === profileId);
  };

  const isConnected = (profileId: string) => {
    return acceptedConnections.some(conn => 
      conn.requester_id === profileId || conn.receiver_id === profileId
    );
  };

  const renderProfileCard = (profile: PTProfile, showActions = true) => (
    <Card key={profile.user_id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.profile_photo_url} alt={`${profile.first_name} ${profile.last_name}`} />
            <AvatarFallback>
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">
                  {profile.first_name} {profile.last_name}
                </h3>
                {profile.current_position && (
                  <p className="text-sm text-muted-foreground">{profile.current_position}</p>
                )}
                {profile.current_employer && (
                  <p className="text-xs text-muted-foreground">{profile.current_employer}</p>
                )}
                {(profile.city || profile.state) && (
                  <p className="text-xs text-muted-foreground">
                    {profile.city}{profile.city && profile.state && ', '}{profile.state}
                  </p>
                )}
              </div>
              
              {showActions && (
                <div className="flex items-center gap-1">
                  {!isConnected(profile.user_id) && !isConnectionRequested(profile.user_id) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConnect(profile.user_id)}
                      disabled={isSendingRequest}
                      className="h-8 px-2"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {isConnectionRequested(profile.user_id) && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Sent
                    </Badge>
                  )}
                  
                  {isConnected(profile.user_id) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Badge variant="default" className="text-xs">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Colleagues
                      </Badge>
                    </>
                  )}
                </div>
              )}
            </div>

            {profile.professional_categories && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.professional_categories.map((category) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
            
            {profile.specializations && (
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.specializations.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

            {profile.about_me && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {profile.about_me}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderConnectionRequest = (request: any) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.requester?.profile_photo_url} />
            <AvatarFallback>
              {request.requester?.first_name?.[0]}{request.requester?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">
                  {request.requester?.first_name} {request.requester?.last_name}
                </h3>
                {request.requester?.current_position && (
                  <p className="text-sm text-muted-foreground">{request.requester.current_position}</p>
                )}
                {request.requester?.current_employer && (
                  <p className="text-xs text-muted-foreground">{request.requester.current_employer}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Wants to connect with you
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAccept(request.id)}
                  disabled={isResponding}
                  className="h-8 px-2 text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecline(request.id)}
                  disabled={isResponding}
                  className="h-8 px-2 text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Mock some fake numbers for demo
  const fakeColleaguesCount = 47;
  const fakePendingCount = 3;
  const fakeSentCount = 5;

  const connectedProfiles = acceptedConnections.map(conn => {
    const isRequester = conn.requester_id === user?.id;
    return isRequester ? conn.receiver : conn.requester;
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="h-6 w-6" />
            Professional Colleagues
          </h2>
          <p className="text-muted-foreground">Connect with PT colleagues and grow your professional network</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{fakeColleaguesCount}</div>
                <div className="text-xs text-muted-foreground">Colleagues</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{fakePendingCount}</div>
                <div className="text-xs text-muted-foreground">Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{fakeSentCount}</div>
                <div className="text-xs text-muted-foreground">Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{filteredProfessionals.length}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover Professionals</TabsTrigger>
          <TabsTrigger value="colleagues">My Colleagues ({fakeColleaguesCount})</TabsTrigger>
          <TabsTrigger value="requests">
            Requests ({fakePendingCount})
            {fakePendingCount > 0 && (
              <div className="ml-1 h-2 w-2 bg-red-500 rounded-full"></div>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, position, or employer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {PROFESSIONAL_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredProfessionals.map(profile => renderProfileCard(profile))}
            {filteredProfessionals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No professionals found matching your criteria. Try adjusting your search or category filter.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="colleagues" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Your Professional Network</h3>
            <p>You have {fakeColleaguesCount} colleagues in your network.</p>
            <p className="text-sm mt-2">Connect with more professionals to expand your network!</p>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Connection Requests</h3>
            <p>You have {fakePendingCount} pending connection requests.</p>
            <p className="text-sm mt-2">Review and respond to build your professional network!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};