import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  XCircle
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
  about_me?: string;
}

export const ProfessionalNetworking = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('discover');
  
  const {
    pendingRequests,
    sentRequests,
    acceptedConnections,
    sendConnectionRequest,
    respondToConnection,
    isSendingRequest,
    isResponding
  } = useConnections();

  // Get all PT professionals
  const { data: ptProfessionals, isLoading } = useQuery({
    queryKey: ['pt-professionals', searchTerm],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id) // Exclude current user
        .eq('is_public', true);
      
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,current_employer.ilike.%${searchTerm}%,current_position.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('first_name');
      if (error) throw error;
      return data as PTProfile[];
    },
    enabled: !!user?.id
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

            {profile.specializations && (
              <div className="flex flex-wrap gap-1 mt-2">
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

  if (isLoading) {
    return <div>Loading PT professionals...</div>;
  }

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
                <div className="text-2xl font-bold">{acceptedConnections.length}</div>
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
                <div className="text-2xl font-bold">{pendingRequests.length}</div>
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
                <div className="text-2xl font-bold">{sentRequests.length}</div>
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
                <div className="text-2xl font-bold">{ptProfessionals?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Discover</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover PTs</TabsTrigger>
          <TabsTrigger value="colleagues">My Colleagues ({acceptedConnections.length})</TabsTrigger>
          <TabsTrigger value="requests">
            Requests ({pendingRequests.length})
            {pendingRequests.length > 0 && (
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
          </div>

          <div className="grid gap-4">
            {ptProfessionals?.map(profile => renderProfileCard(profile))}
          </div>
        </TabsContent>

        <TabsContent value="colleagues" className="space-y-4">
          <div className="grid gap-4">
            {connectedProfiles.map(profile => renderProfileCard(profile as PTProfile, false))}
          </div>
          {connectedProfiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No colleagues yet. Start connecting with other PTs!
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid gap-4">
            {pendingRequests.map(request => renderConnectionRequest(request))}
          </div>
          {pendingRequests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No pending connection requests
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};