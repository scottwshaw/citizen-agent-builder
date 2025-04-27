'use client';

import { Agent } from '../../types/agent';
import { useState } from 'react';
import { AgentExecutor } from '../../services/agentExecutor';
import { ExecutionStep } from '../../types/executionStep';

interface AgentDetailsProps {
  agent: Agent;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function AgentDetails({ agent, onClose, onDelete }: AgentDetailsProps) {
  const [executing, setExecuting] = useState(false);
  const [query, setQuery] = useState('');
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const executor = new AgentExecutor();

  const handleExecute = async () => {
    setExecuting(true);
    setSteps([]);
    
    await executor.execute(
      agent,
      query,
      (step) => setSteps(prev => [...prev, step]),
      (error) => console.error(error)
    );
    
    setExecuting(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{agent.name}</h2>
        <div className="flex gap-4">
          <button
            onClick={() => onDelete(agent.id)}
            className="text-red-500 hover:text-red-700"
            aria-label="Delete agent"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
      </div>
      <pre className="bg-gray-50 p-4 rounded-md">{agent.systemPrompt}</pre>
      <div className="mt-4">
        <h3>Tools: {agent.tools.length}</h3>
        {agent.tools.map((tool, i) => (
          <div key={i} className="mt-2 p-2 border rounded">{tool.name}</div>
        ))}
      </div>
      
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Execute Agent</h3>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your query..."
        />
        <button
          onClick={handleExecute}
          disabled={executing || !query}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {executing ? 'Executing...' : 'Execute'}
        </button>
        
        <div className="mt-4 space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="p-2 border rounded">
              <div className="font-medium">{step.type}</div>
              <div className="text-sm">{step.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}