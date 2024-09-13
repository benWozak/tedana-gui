export interface BoldMetadata {
  echo_num: number;
  delay_time: number;
  echo_time: number;
  repetition_time: number;
  skull_stripped: boolean;
  slice_timing_corrected: boolean;
  start_time: number;
  task_name: string;
  nifti_file_path: string;
}

export interface TedanaConfig {
  dataFiles: string[];
  echoTimes: number[];
  outDir: string;
  mask: string;
  prefix: string;
  convention: "orig" | "bids";
  maskType: ("dropout" | "decay" | "none")[];
  fitType: "loglin" | "curvefit";
  combMode: "t2s";
  tedpca: string | number;
  tree: string;
  seed: number;
  maxit: number;
  maxrestart: number;
  tedort: boolean;
  gscontrol: ("mir" | "gsr")[];
  noReports: boolean;
  pngCmap: string;
  verbose: boolean;
  lowmem: boolean;
  nThreads: number;
  debug: boolean;
  t2smap: string;
  mix: string;
  overwrite: boolean;
}