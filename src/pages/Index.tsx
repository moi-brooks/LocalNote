import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Moon, Sun, Save, Trash2, BookOpen, List } from 'lucide-react';
import Terminal from '@/components/Terminal';
import NotesList from '@/components/NotesList';
import { useTheme } from '@/hooks/useTheme';
import { useNotes } from '@/hooks/useNotes';
import { useCommands } from '@/hooks/useCommands';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { 
    notes, 
    currentNote, 
    setCurrentNote, 
    saveNote, 
    deleteNote, 
    createNewNote,
    updateNoteContent
  } = useNotes();
  const { processCommand } = useCommands();
  const [showNotes, setShowNotes] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
        toast('New note created');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNewNote]);

  // Auto-focus terminal on load
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.focus();
    }
  }, []);

  const toggleNotesList = () => {
    setShowNotes(!showNotes);
  };

  const handleCommandSubmit = (command: string) => {
    processCommand(command);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground font-mono transition-colors duration-300`}>
      {/* Header */}
      <header className="border-b border-border p-2 flex justify-between items-center">
        <div className="text-lg font-bold">
          LocalNote
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleNotesList}
            title="Toggle notes list"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={createNewNote}
            title="New note (Ctrl+N)"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={saveNote}
            title="Save note (Ctrl+S)"
            disabled={!currentNote}
          >
            <Save className="h-5 w-5" />
          </Button>
          {currentNote && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDeleteNote(currentNote.id)}
              title="Delete note"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Notes sidebar */}
        {showNotes && (
          <NotesList 
            notes={notes} 
            currentNoteId={currentNote?.id} 
            onSelectNote={setCurrentNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
        
        {/* Terminal */}
        <div className="flex-1 p-4 overflow-auto" ref={terminalRef}>
          <Terminal 
            currentNote={currentNote} 
            onContentChange={updateNoteContent}
            onCommandSubmit={handleCommandSubmit}
            onSave={saveNote}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
