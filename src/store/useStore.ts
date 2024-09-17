import { create } from 'zustand'

interface StoreState {
  inputDir: string
  outputDir: string
  pythonPath: string
  tedanaStatus: string
  commandExecutable: string

  // Define your actions here
  setInputDir: (dir: string) => void
  setOutputDir: (dir: string) => void
  setPythonPath: (path: string) => void
  setTedanaStatus: (status: string) => void
  setCommandExecutable: (commandExecutable: string) => void
}

const useStore = create<StoreState>((set) => ({
  // Initial state
  inputDir: '',
  outputDir: '',
  pythonPath: '',
  tedanaStatus: 'Not checked',
  commandExecutable: '',

  // Actions
  setInputDir: (dir) => set({ inputDir: dir }),
  setOutputDir: (dir) => set({ outputDir: dir }),
  setPythonPath: (path) => set({ pythonPath: path }),
  setTedanaStatus: (status) => set({ tedanaStatus: status }),
  setCommandExecutable: (commandExecutable) => set({ commandExecutable: commandExecutable})
}))

export default useStore