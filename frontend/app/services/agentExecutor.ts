import { Agent } from '../types/agent';
import { ExecutionStep } from '../types/executionStep';

export class AgentExecutor {
  private ws: WebSocket | null = null;

  async execute(agent: Agent, query: string, 
    onStep: (step: ExecutionStep) => void,
    onError: (error: any) => void) {
    
    this.ws = new WebSocket('ws://localhost:8000/ws/execute');
    
    this.ws.onmessage = (event) => {
      const step = JSON.parse(event.data);
      onStep(step);
    };
    
    this.ws.onerror = (error) => {
      onError(error);
    };
    
    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({ agent, query }));
    };
  }

  stop() {
    this.ws?.close();
  }
}
