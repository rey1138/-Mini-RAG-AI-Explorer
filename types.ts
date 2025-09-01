
export interface Chunk {
  id: number;
  content: string;
}

export enum AppState {
  INITIAL = 'INITIAL',
  INGESTED = 'INGESTED',
  ANSWERED = 'ANSWERED',
}

export interface RequestDetails {
  time: number;
  tokens: number;
}
