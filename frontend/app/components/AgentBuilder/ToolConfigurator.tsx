'use client';

import { useState } from 'react';
import { Tool } from '../../types/agent';

interface ToolConfiguratorProps {
  tools: Tool[];
  onChange: (tools: Tool[]) => void;
}

export default function ToolConfigurator({ tools, onChange }: ToolConfiguratorProps) {
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: '',
    description: '',
    parameters: []
  });

  const addTool = () => {
    if (newTool.name && newTool.description) {
      onChange([...tools, { ...newTool, parameters: [] } as Tool]);
      setNewTool({ name: '', description: '', parameters: [] });
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-2">
        Tools
      </label>
      
      <div className="space-y-2">
        {tools.map((tool, index) => (
          <div key={index} className="p-4 border rounded-md">
            <h4 className="font-medium">{tool.name}</h4>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border rounded-md p-4">
        <input
          type="text"
          placeholder="Tool Name"
          value={newTool.name}
          onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
        <textarea
          placeholder="Tool Description"
          value={newTool.description}
          onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
        <button
          type="button"
          onClick={addTool}
          className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Add Tool
        </button>
      </div>
    </div>
  );
} 