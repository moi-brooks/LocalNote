
import { useCallback } from 'react';
import { useTheme } from './useTheme';
import { toast } from '@/components/ui/sonner';

export const useCommands = () => {
  const { theme, toggleTheme } = useTheme();
  
  const processCommand = useCallback((command: string) => {
    const cleanCommand = command.trim().toLowerCase();
    
    // Handle theme commands
    if (cleanCommand === 'theme dark' || cleanCommand === 'dark') {
      if (theme !== 'dark') {
        toggleTheme();
        toast('Dark theme activated');
      }
      return;
    }
    
    if (cleanCommand === 'theme light' || cleanCommand === 'light') {
      if (theme !== 'light') {
        toggleTheme();
        toast('Light theme activated');
      }
      return;
    }
    
    if (cleanCommand === 'help') {
      toast('Available Commands: theme dark/light, help, clear, export', {
        description: 'Type any command to execute',
        duration: 5000,
      });
      return;
    }
    
    if (cleanCommand === 'export' || cleanCommand === 'export all') {
      try {
        const notesData = localStorage.getItem('notes');
        if (!notesData) {
          toast('No notes to export');
          return;
        }
        
        // Create a downloadable file
        const blob = new Blob([notesData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `term-notes-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast('Notes exported successfully');
      } catch (err) {
        toast('Export failed', {
          description: 'Could not export notes',
          // Using the correct property for error styling in sonner
          style: { backgroundColor: 'hsl(var(--destructive))' }
        });
      }
      return;
    }
    
    // Unknown command
    toast(`Unknown command: ${command}`, {
      description: 'Type "help" for available commands',
      // Using the correct property for error styling in sonner
      style: { backgroundColor: 'hsl(var(--destructive))' }
    });
  }, [theme, toggleTheme]);
  
  return { processCommand };
};
