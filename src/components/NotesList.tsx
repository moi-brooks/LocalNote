
import React from 'react';
import { Note } from '@/types/note';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotesListProps {
  notes: Note[];
  currentNoteId?: string;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ 
  notes, 
  currentNoteId, 
  onSelectNote,
  onDeleteNote 
}) => {
  return (
    <div className="w-64 border-r border-border overflow-y-auto bg-muted/30">
      <div className="p-2 border-b border-border font-semibold">
        Notes ({notes.length})
      </div>
      <div className="divide-y divide-border">
        {notes.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No notes yet. Create one to get started.
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id}
              className={`p-3 cursor-pointer hover:bg-muted transition-colors duration-200
                ${note.id === currentNoteId ? 'bg-muted border-l-2 border-primary' : ''}`}
            >
              <div 
                className="flex items-center justify-between"
              >
                <div 
                  className="flex-1"
                  onClick={() => onSelectNote(note)}
                >
                  <div className="font-medium truncate text-sm">
                    {note.title || 'Untitled Note'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                    <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
                    <span>{note.content.length} chars</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  title="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
