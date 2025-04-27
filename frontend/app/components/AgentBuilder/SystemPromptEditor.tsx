'use client';

interface SystemPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SystemPromptEditor({ value, onChange }: SystemPromptEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        System Prompt
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-40 p-2 border rounded-md font-mono"
        placeholder="Enter the system prompt for your agent..."
        required
      />
    </div>
  );
} 