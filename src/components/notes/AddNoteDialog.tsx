import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface AddNoteDialogProps {
  entityType: 'company' | 'school' | 'job_listing' | 'provider' | 'consultant_company' | 'equipment_company' | 'pe_firm' | 'profile';
  entityId: string;
  note?: any;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

export const AddNoteDialog = ({ 
  entityType, 
  entityId, 
  note, 
  onClose, 
  trigger 
}: AddNoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!note;

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title || '',
        content: note.content || '',
      });
      setOpen(true);
    }
  }, [note, form]);

  const mutation = useMutation({
    mutationFn: async (data: NoteFormData) => {
      console.log('Submitting note:', data, 'for entity:', entityType, entityId);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to create notes');
      }
      
      const noteData = {
        title: data.title,
        content: data.content || null,
        entity_type: entityType,
        entity_id: entityId,
        user_id: user.id,
      };

      if (isEditing) {
        console.log('Updating note:', note.id);
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', note.id);
        if (error) throw error;
      } else {
        console.log('Creating new note with data:', noteData);
        const { error } = await supabase
          .from('notes')
          .insert(noteData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      console.log('Note operation successful');
      queryClient.invalidateQueries({ queryKey: ['notes', entityType, entityId] });
      toast({
        title: 'Success',
        description: isEditing ? 'Note updated successfully!' : 'Note added successfully!',
      });
      handleClose();
    },
    onError: (error) => {
      console.error('Note operation failed:', error);
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update note. Please try again.' : 'Failed to add note. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
    if (!isEditing) form.reset();
  };

  const onSubmit = (data: NoteFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditing && trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Note' : 'Add New Note'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your note details below.' : 'Create a new note to track important information.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add your notes here..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Note' : 'Add Note')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};