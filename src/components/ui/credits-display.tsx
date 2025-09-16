import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const CreditsDisplay = () => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCredits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No credits record exists, create one
          const { data: newCredits, error: createError } = await supabase
            .from('user_credits')
            .insert({ user_id: user.id, balance: 10 }) // Give new users 10 free credits
            .select('balance')
            .single();
          
          if (!createError && newCredits) {
            setCredits(newCredits.balance);
            toast({
              title: "Welcome!",
              description: "You've received 10 free credits to get started!",
            });
          }
        } else {
          throw error;
        }
      } else if (data) {
        setCredits(data.balance);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFreeCredits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('credit-management', {
        body: {
          action: 'purchase',
          amount: 50
        }
      });

      if (error) throw error;

      if (data.success) {
        setCredits(data.new_balance);
        toast({
          title: "Credits Added!",
          description: `Added 50 free credits. New balance: ${data.new_balance}`,
        });
      }
    } catch (error: any) {
      console.error('Error adding credits:', error);
      toast({
        title: "Error",
        description: "Failed to add credits",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  if (loading) {
    return (
      <Badge variant="secondary" className="gap-2">
        <Coins className="h-4 w-4" />
        Loading...
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={credits > 0 ? "default" : "destructive"} className="gap-2">
        <Coins className="h-4 w-4" />
        {credits} credits
      </Badge>
      {credits < 5 && (
        <Button size="sm" variant="outline" onClick={addFreeCredits} className="gap-1">
          <Plus className="h-3 w-3" />
          Get 50 Free
        </Button>
      )}
    </div>
  );
};