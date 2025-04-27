'use client';

import { Agent } from '../../types/agent';

interface AgentListProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  selectedAgent: Agent | null;
}

export default function AgentList({ agents, onSelectAgent }: AgentListProps) {
  return (
    <div className="space-y-4">
      {agents.length === 0 ? (
        <p className="text-gray-500">No agents created yet</p>
      ) : (
        agents.map((agent) => (
          <div
            key={agent.id}
            className="p-4 border rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectAgent(agent)}
          >
            <h3 className="font-medium">{agent.name}</h3>
            <p className="text-sm text-gray-600">
              Created: {agent.createdAt.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Tools: {agent.tools.length}
            </p>
          </div>
        ))
      )}
    </div>
  );
} 