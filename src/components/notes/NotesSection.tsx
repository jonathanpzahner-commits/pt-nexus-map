import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { AddNoteDialog } from './AddNoteDialog';
import { NoteCard } from './NoteCard';

interface NotesSectionProps {
  entityType: 'company' | 'school' | 'job_listing' | 'provider' | 'consultant_company' | 'equipment_company' | 'pe_firm' | 'profile';
  entityId: string;
  entityName: string;
}

export const NotesSection = ({ entityType, entityId, entityName }: NotesSectionProps) => {
  const [editingNote, setEditingNote] = useState<any>(null);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', entityType, entityId],
    queryFn: async () => {
      console.log('Fetching notes for:', entityType, entityId);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
      console.log('Notes fetched:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading notes...</p>
        </CardContent>
      </Card>
    );
  }

  console.log('NotesSection rendering for:', entityName, 'with', notes.length, 'notes');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes for {entityName}
          </CardTitle>
          <AddNoteDialog 
            entityType={entityType} 
            entityId={entityId}
            trigger={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No notes yet. Add your first note to keep track of important information.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onEdit={setEditingNote}
              />
            ))}
          </div>
        )}
      </CardContent>
      
      {editingNote && (
        <AddNoteDialog
          entityType={entityType}
          entityId={entityId}
          note={editingNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </Card>
  );
};