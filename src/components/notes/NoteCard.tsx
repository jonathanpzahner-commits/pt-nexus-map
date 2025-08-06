import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: any;
  onEdit: (note: any) => void;
}

export const NoteCard = ({ note, onEdit }: NoteCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Success',
        description: 'Note deleted successfully!',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting note:', error);
    },
  });

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{note.title}</h4>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
              {note.updated_at !== note.created_at && ' (edited)'}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-7 w-7 p-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Note</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this note? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      {note.content && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {note.content}
          </p>
        </CardContent>
      )}
    </Card>
  );
};