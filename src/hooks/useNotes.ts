
import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { toast } from '@/components/ui/sonner';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes) as Note[];
        setNotes(parsedNotes);
        
        // Set the current note to the most recently updated one
        if (parsedNotes.length > 0) {
          const sorted = [...parsedNotes].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setCurrentNote(sorted[0]);
        }
      } catch (e) {
        console.error('Failed to parse saved notes', e);
        toast('Error loading notes', {
          description: 'Failed to load saved notes',
          style: { backgroundColor: 'hsl(var(--destructive))' }
        });
      }
    } else {
      // Create a default note if no notes exist
      const defaultNote = createDefaultNote();
      setNotes([defaultNote]);
      setCurrentNote(defaultNote);
      localStorage.setItem('notes', JSON.stringify([defaultNote]));
    }
  }, []);

  // Create a default note
  const createDefaultNote = () => {
    return {
      id: Date.now().toString(),
      title: 'Welcome Note',
      content: 'Welcome to term-note-scribe!\n\nStart typing to create your first note.\n\nTips:\n- Use ":" to enter command mode\n- Type "help" for available commands',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    } else {
      localStorage.removeItem('notes');
    }
  }, [notes]);

  // Create a new note
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote);
    return newNote;
  };

  // Update current note content
  const updateNoteContent = (content: string) => {
    if (!currentNote) return;
    
    setCurrentNote({
      ...currentNote,
      content,
      // Auto-update title based on the first line of content
      title: content.split('\n')[0]?.trim() || 'Untitled Note',
    });
  };

  // Save the current note
  const saveNote = () => {
    if (!currentNote) return;
    
    const updatedNote = {
      ...currentNote,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    
    setNotes(updatedNotes);
    setCurrentNote(updatedNote);
    
    toast('Note saved');
    return updatedNote;
  };

  // Delete a note
  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    if (currentNote?.id === id) {
      setCurrentNote(updatedNotes[0] || null);
    }
    
    toast('Note deleted');
  };

  return {
    notes,
    currentNote,
    setCurrentNote,
    createNewNote,
    updateNoteContent,
    saveNote,
    deleteNote,
  };
};
