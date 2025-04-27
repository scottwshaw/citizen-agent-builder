export interface Tool {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

export interface Agent {
  id: string;
  name: string;
  systemPrompt: string;
  tools: Tool[];
  createdAt: Date;
  lastExecuted?: Date;
}

export interface ExecutionStep {
  type: 'reasoning' | 'action' | 'observation';
  content: string;
  timestamp: Date;
}

export interface ExecutionCycle {
  agentId: string;
  input: string;
  steps: ExecutionStep[];
  status: 'running' | 'completed' | 'error';
  result?: string;
} 