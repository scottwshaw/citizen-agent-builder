export interface ExecutionStep {
    type: 'reasoning' | 'action' | 'observation';
    content: string;
    timestamp: Date;
  }