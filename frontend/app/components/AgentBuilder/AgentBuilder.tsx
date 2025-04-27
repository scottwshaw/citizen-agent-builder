'use client';

import { useState } from 'react';
import { Agent, Tool } from '../../types/agent';
import SystemPromptEditor from './SystemPromptEditor';
import ToolConfigurator from './ToolConfigurator';

interface AgentBuilderProps {
  onCreateAgent: (agent: Agent) => void;
}

export default function AgentBuilder({ onCreateAgent }: AgentBuilderProps) {
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name,
      systemPrompt,
      tools,
      createdAt: new Date(),
    };
    onCreateAgent(newAgent);
    // Reset form
    setName('');
    setSystemPrompt('');
    setTools([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Agent Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <SystemPromptEditor
        value={systemPrompt}
        onChange={setSystemPrompt}
      />

      <ToolConfigurator
        tools={tools}
        onChange={setTools}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Create Agent
      </button>
    </form>
  );
} 