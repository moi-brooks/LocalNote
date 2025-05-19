
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/types/note';

interface TerminalProps {
  currentNote: Note | null;
  onContentChange: (content: string) => void;
  onCommandSubmit: (command: string) => void;
  onSave: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ 
  currentNote, 
  onContentChange,
  onCommandSubmit,
  onSave
}) => {
  const [input, setInput] = useState('');
  const [commandMode, setCommandMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentNote]);

  // Update input when currentNote changes
  useEffect(() => {
    if (currentNote && !commandMode) {
      setInput(currentNote.content);
    }
  }, [currentNote, commandMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save with Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave();
      return;
    }

    // Enter command mode with ":"
    if (e.key === ':' && !commandMode && input === '') {
      e.preventDefault();
      setCommandMode(true);
      setInput(':');
    }
    
    // Submit command with Enter when in command mode
    if (e.key === 'Enter' && commandMode) {
      e.preventDefault();
      const command = input.slice(1); // Remove the leading ":"
      onCommandSubmit(command);
      setCommandMode(false);
      setInput('');
      
      // Restore note content after exiting command mode
      if (currentNote) {
        setInput(currentNote.content);
      }
    }

    // Exit command mode with Escape
    if (e.key === 'Escape' && commandMode) {
      e.preventDefault();
      setCommandMode(false);
      
      // Restore note content after exiting command mode
      if (currentNote) {
        setInput(currentNote.content);
      } else {
        setInput('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    if (!commandMode && currentNote) {
      onContentChange(newValue);
    }
  };

  return (
    <div className="terminal h-full flex flex-col">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={commandMode ? 'Enter command...' : currentNote ? 'Start typing...' : 'Create or select a note to start typing, or use ":" to enter commands...'}
          className={`min-h-[calc(100vh-120px)] w-full resize-none border rounded-md p-4 font-mono text-base bg-background 
            ${commandMode ? 'text-primary' : 'text-foreground'}`}
          disabled={!currentNote && !commandMode}
        />
        {commandMode && (
          <div className="absolute bottom-4 right-4 text-sm opacity-70">
            Command Mode | ESC to cancel
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
