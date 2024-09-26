import { useState, useCallback, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import useStore from '../../store/useStore';

export function useTedanaExecution() {
  const [output, setOutput] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { commandExecutable } = useStore();
  const pythonPath = localStorage.getItem('pythonPath');

  useEffect(() => {
    const unlisten1 = listen('tedana-output', (event: any) => {
      setOutput(prev => [...prev, { content: event.payload as string, isError: false }]);
    });

    const unlisten2 = listen('tedana-error', (event: any) => {
      setOutput(prev => [...prev, { content: event.payload as string, isError: true }]);
    });

    return () => {
      unlisten1.then(f => f());
      unlisten2.then(f => f());
    };
  }, []);

  const executeTedanaCommand = useCallback(async (selectedSubjects: string[], selectedSessions: { [subjectId: string]: string[] }): Promise<boolean> => {
    setLoading(true);
    setOutput([]);

    try {
      for (const subjectId of selectedSubjects) {
        const sessions = selectedSessions[subjectId] || [];
        for (const sessionId of sessions) {
          const specificCommand = generateSpecificCommand(commandExecutable, subjectId, sessionId);
          setOutput(prev => [...prev, { content: `Executing command: ${specificCommand}`, isError: false }]);
          console.log(`Executing for ${subjectId}, ${sessionId}: ${specificCommand}`);
          await invoke('run_tedana_command', {
            pythonPath,
            commandArgs: specificCommand,
          });
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