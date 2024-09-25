import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import useStore from '../../store/useStore';

interface OutputLine {
  content: string;
  isError: boolean;
}

export function useTedanaExecution() {
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [loading, setLoading] = useState(false);
  const { commandExecutable } = useStore();
  const pythonPath = localStorage.getItem('pythonPath');
  // const environmentPath = localStorage.getItem('environmentPath');

  const executeTedanaCommand = useCallback(async (selectedSubjects: string[], selectedSessions: { [subjectId: string]: string[] }): Promise<boolean> => {
    setLoading(true);
    setOutput([]);
  
  
    try {
      for (const subjectId of selectedSubjects) {
        const sessions = selectedSessions[subjectId] || [];
        for (const sessionId of sessions) {
          const specificCommand = generateSpecificCommand(commandExecutable, subjectId, sessionId);
          console.log(`Executing for ${subjectId}, ${sessionId}: ${specificCommand}`);
          const result = await invoke('run_tedana_command', {
            pythonPath,
            commandArgs: specificCommand,
          });
          setOutput(prev => [...prev, { content: `Tedana execution completed for subject ${subjectId}, session ${sessionId}`, isError: false }]);
          console.log(`Tedana execution result for ${subjectId}, ${sessionId}:`, result);
        }
      }
      setLoading(false);
      return true;
    } catch (error) {
      console.error(`Error executing tedana:`, error);
      setOutput(prev => [...prev, { content: `Execution error: ${error}`, isError: true }]);
      setLoading(false);
      return false;
    }
  }, [commandExecutable]);

  const generateSpecificCommand = (baseCommand: string, subjectId: string, sessionId: string) => {
    return baseCommand
      .replace(/\$\{SUBJECT\}/g, subjectId)
      .replace(/\$\{SESSION\}/g, sessionId);
  };

  const killTedanaExecution = useCallback(async () => {
    try {
      await invoke('kill_tedana_command');
      setOutput((prev) => [...prev, { content: 'Tedana execution was terminated by user', isError: false }]);
      setLoading(false);
    } catch (error) {
      console.error('Error killing Tedana process:', error);
      setOutput((prev) => [...prev, { content: `Error killing Tedana process: ${error}`, isError: true }]);
    }
  }, []);

  return { output, loading, executeTedanaCommand, killTedanaExecution };
}