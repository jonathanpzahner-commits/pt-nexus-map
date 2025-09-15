import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface ConnectionRequest {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  requester?: {
    first_name: string;
    last_name: string;
    current_position?: string;
    current_employer?: string;
    profile_photo_url?: string;
  };
  receiver?: {
    first_name: string;
    last_name: string;
    current_position?: string;
    current_employer?: string;
    profile_photo_url?: string;
  };
}

export const useConnections = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get connection requests (both sent and received)
  const { data: connectionRequests, isLoading } = useQuery({
    queryKey: ['connection-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get the connections
      const { data: connections, error: connectionsError } = await supabase
        .from('pt_connections')
        .select('*')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (connectionsError) throw connectionsError;
      if (!connections) return [];

      // Get all unique user IDs involved in connections
      const userIds = new Set<string>();
      connections.forEach(conn => {
        userIds.add(conn.requester_id);
        userIds.add(conn.receiver_id);
      });

      // Fetch profiles for all involved users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, current_position, current_employer, profile_photo_url')
        .in('user_id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create a map of profiles by user_id
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Combine connections with profile data
      const enrichedConnections = connections.map(conn => ({
        ...conn,
        requester: profileMap.get(conn.requester_id),
        receiver: profileMap.get(conn.receiver_id)
      }));
      
      return enrichedConnections as ConnectionRequest[];
    },
    enabled: !!user?.id
  });

  // Send connection request
  const sendConnectionRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('pt_connections')
        .insert({
          requester_id: user.id,
          receiver_id: receiverId,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Connection request sent!');
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('Connection request already exists');
      } else {
        toast.error('Failed to send connection request');
      }
    }
  });

  // Respond to connection request
  const respondToConnection = useMutation({
    mutationFn: async ({ connectionId, status }: { connectionId: string; status: 'accepted' | 'declined' }) => {
      const { error } = await supabase
        .from('pt_connections')
        .update({ status })
        .eq('id', connectionId);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast.success(status === 'accepted' ? 'Connection accepted!' : 'Connection declined');
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] });
      queryClient.invalidateQueries({ queryKey: ['colleagues'] });
    },
    onError: () => {
      toast.error('Failed to respond to connection request');
    }
  });

  // Get pending requests (received by current user)
  const pendingRequests = connectionRequests?.filter(
    req => req.receiver_id === user?.id && req.status === 'pending'
  ) || [];

  // Get sent requests (sent by current user)
  const sentRequests = connectionRequests?.filter(
    req => req.requester_id === user?.id && req.status === 'pending'
  ) || [];

  // Get accepted connections
  const acceptedConnections = connectionRequests?.filter(
    req => req.status === 'accepted'
  ) || [];

  return {
    connectionRequests,
    pendingRequests,
    sentRequests,
    acceptedConnections,
    isLoading,
    sendConnectionRequest: sendConnectionRequest.mutate,
    respondToConnection: respondToConnection.mutate,
    isSendingRequest: sendConnectionRequest.isPending,
    isResponding: respondToConnection.isPending
  };
};