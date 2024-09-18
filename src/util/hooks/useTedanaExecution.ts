import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import useStore from '../../store/useStore';

interface OutputLine {
  content: string;
  isError: boolean;
}

export function useTedanaExecution() {
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [loading, setLoading] = useState(false);
  const { pythonPath, commandExecutable } = useStore(); 

  const executeTedanaCommand = useCallback(async () => {
    setLoading(true);
    setOutput([]);

    const unlisten = await listen('tedana-progress', (event) => {
      setOutput((prev) => [...prev, { content: event.payload as string, isError: false }]);
    });

    const unlistenError = await listen('tedana-error', (event) => {
      setOutput((prev) => [...prev, { content: event.payload as string, isError: true }]);
    });

    try {
      const result = await invoke('run_tedana', {
        pythonPath,
        commandArgs: commandExecutable,
      });
      console.log('Tedana execution result:', result);
      setOutput((prev) => [...prev, { content: 'Tedana execution completed successfully', isError: false }]);
      return true;
    } catch (error) {
      console.error('Error executing tedana:', error);
      setOutput((prev) => [...prev, { content: `Execution error: ${error}`, isError: true }]);
      return false;
    } finally {
      setLoading(false);
      unlisten();
      unlistenError();
    }
  }, [pythonPath, commandExecutable]);

  return { output, loading, executeTedanaCommand };
}