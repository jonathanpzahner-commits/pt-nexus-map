import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Coins, Lock, Phone, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactUnlockButtonProps {
  entityId: string;
  entityType: 'profile' | 'consultant_company' | 'equipment_company' | 'provider';
  userId?: string;
  hasContactInfo: boolean;
  size?: 'sm' | 'default';
}

export const ContactUnlockButton = ({ entityId, entityType, userId, hasContactInfo, size = 'default' }: ContactUnlockButtonProps) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedContact, setUnlockedContact] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleUnlock = async () => {
    if (!hasContactInfo) {
      toast({
        title: "No Contact Information",
        description: "This person hasn't provided contact information.",
        variant: "destructive"
      });
      return;
    }

    setIsUnlocking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('unlock-contact-info', {
        body: {
          target_entity_id: entityId,
          target_entity_type: entityType,
          target_user_id: userId
        }
      });

      if (error) throw error;

      if (data.success) {
        setUnlockedContact(data.contact_info);
        toast({
          title: "Contact Info Unlocked!",
          description: `Used 1 credit to access contact information.`,
        });
      } else if (data.error) {
        if (data.error.includes('Insufficient credits')) {
          toast({
            title: "Insufficient Credits",
            description: `You need 1 credit to unlock contact info. Current balance: ${data.current_balance || 0}`,
            variant: "destructive"
          });
        } else {
          throw new Error(data.error);
        }
      }
    } catch (error: any) {
      console.error('Error unlocking contact info:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to unlock contact information",
        variant: "destructive"
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  if (unlockedContact) {
    return (
      <div className="space-y-2">
        {unlockedContact.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${unlockedContact.email}`} className="text-blue-600 hover:underline">
              {unlockedContact.email}
            </a>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        )}
        {unlockedContact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <a href={`tel:${unlockedContact.phone}`} className="text-blue-600 hover:underline">
              {unlockedContact.phone}
            </a>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        )}
        {unlockedContact.preferred_contact_method && (
          <Badge variant="outline" className="text-xs">
            Prefers: {unlockedContact.preferred_contact_method}
          </Badge>
        )}
      </div>
    );
  }

  if (!hasContactInfo) {
    return (
      <Badge variant="secondary" className="text-xs">
        <Lock className="h-3 w-3 mr-1" />
        No contact info available
      </Badge>
    );
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size={size}
          className="gap-2"
          disabled={isUnlocking}
        >
          <Lock className="h-4 w-4" />
          <Coins className="h-4 w-4" />
          Unlock Contact (1 credit)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock Contact Information</DialogTitle>
          <DialogDescription>
            This will use 1 credit from your account to unlock this person's contact information.
            Once unlocked, you'll have permanent access to their email and phone number.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setShowDialog(false);
              handleUnlock();
            }}
            disabled={isUnlocking}
            className="gap-2"
          >
            <Coins className="h-4 w-4" />
            {isUnlocking ? 'Unlocking...' : 'Use 1 Credit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};