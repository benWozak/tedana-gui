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
      const result = await invoke('run_tedana_command', {
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