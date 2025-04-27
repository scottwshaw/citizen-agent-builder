'use client';

import { useState, useEffect } from 'react';
import { Agent } from './types/agent';
import AgentList from './components/AgentList/AgentList';
import AgentBuilder from './components/AgentBuilder/AgentBuilder';
import AgentDetails from './components/AgentDetails/AgentDetails';

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agents');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  const handleCreateAgent = (newAgent: Agent) => {
    setAgents([...agents, newAgent]);
    setSelectedAgent(null);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Citizen Agent Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Agents</h2>
          <AgentList 
            agents={agents} 
            onSelectAgent={setSelectedAgent}
            selectedAgent={selectedAgent}
          />
        </div>
        
        <div>
          {selectedAgent ? (
            <AgentDetails 
              agent={selectedAgent} 
              onClose={() => setSelectedAgent(null)}
              onDelete={handleDeleteAgent}
            />
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Create New Agent</h2>
              <AgentBuilder onCreateAgent={handleCreateAgent} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
