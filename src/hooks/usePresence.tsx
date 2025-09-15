import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ColleaguePresence {
  colleague_id: string;
  first_name: string;
  last_name: string;
  current_position: string;
  current_employer: string;
  profile_photo_url: string;
  is_online: boolean;
  last_seen: string;
  activity_status: string;
}

export const usePresence = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [presenceChannel, setPresenceChannel] = useState<any>(null);

  // Get user's colleagues with presence info
  const { data: colleagues, isLoading } = useQuery({
    queryKey: ['colleagues', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase.rpc('get_user_colleagues', {
        p_user_id: user.id
      });
      
      if (error) throw error;
      return data as ColleaguePresence[];
    },
    enabled: !!user?.id
  });

  // Update user presence
  const updatePresenceMutation = useMutation({
    mutationFn: async ({ isOnline, activityStatus }: { isOnline: boolean; activityStatus?: string }) => {
      if (!user?.id) return;
      
      const { error } = await supabase.rpc('update_user_presence', {
        p_user_id: user.id,
        p_is_online: isOnline,
        p_activity_status: activityStatus || 'Available'
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleagues'] });
    }
  });

  // Set up real-time presence tracking
  useEffect(() => {
    if (!user?.id) return;

    // Update presence when user comes online
    updatePresenceMutation.mutate({ isOnline: true });

    // Set up real-time channel for presence updates
    const channel = supabase.channel('pt-presence')
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync event');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        queryClient.invalidateQueries({ queryKey: ['colleagues'] });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        queryClient.invalidateQueries({ queryKey: ['colleagues'] });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track user presence
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    setPresenceChannel(channel);

    // Update presence when user becomes inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresenceMutation.mutate({ isOnline: false, activityStatus: 'Away' });
      } else {
        updatePresenceMutation.mutate({ isOnline: true, activityStatus: 'Available' });
      }
    };

    // Update presence on page unload
    const handleBeforeUnload = () => {
      updatePresenceMutation.mutate({ isOnline: false });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      updatePresenceMutation.mutate({ isOnline: false });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);

  const onlineColleagues = colleagues?.filter(c => c.is_online) || [];

  return {
    colleagues,
    onlineColleagues,
    isLoading,
    updatePresence: updatePresenceMutation.mutate
  };
};