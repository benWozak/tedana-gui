export interface BoldMetadata {
  echo_num: number;
  delay_time?: number;
  echo_time?: number;
  repetition_time?: number;
  skull_stripped?: boolean;
  slice_timing_corrected?: boolean;
  start_time?: number;
  task_name?: string;
}

export interface Session {
  sub_id: number;
  name: string;
  echo_nifti_file_paths: string[];
}

export interface Subject {
  id: number;
  name: string;
  sessions: Session[];
}

export interface BidsStructure {
  metadata: BoldMetadata[];
  subjects: Subject[];
}

export interface TedanaConfig {
  dataFiles: string[];
  echoTimes: number[];
  outDir: string;
  mask: string;
  prefix: string;
  convention: "orig" | "bids" | null;
  maskType: "dropout" | "decay" | "";
  fitType: "loglin" | "curvefit" | null;
  combMode: "t2s" | null;
  tedpca: string | null;
  tree: string | null;
  seed: number | null;
  maxit: number | null;
  maxrestart: number | null;
  tedort: boolean;
  gscontrol: ("mir" | "gsr" | "") | null;
  noReports: boolean;
  pngCmap: string | null;
  verbose: boolean;
  lowmem: boolean;
  nThreads: number | null;
  debug: boolean;
  t2smap: string | null;
  mix: string | null;
  overwrite: boolean;
}