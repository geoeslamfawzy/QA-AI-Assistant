export interface CollectionProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentSuite: string;
  completedSuites: number;
  totalSuites: number;
  message: string;
}

let progress: CollectionProgress = {
  status: 'idle',
  currentSuite: '',
  completedSuites: 0,
  totalSuites: 0,
  message: '',
};

export function getCollectionProgress(): CollectionProgress {
  return { ...progress };
}

export function updateCollectionProgress(p: Partial<CollectionProgress>) {
  Object.assign(progress, p);
}

export function resetCollectionProgress() {
  progress = {
    status: 'idle',
    currentSuite: '',
    completedSuites: 0,
    totalSuites: 0,
    message: '',
  };
}
