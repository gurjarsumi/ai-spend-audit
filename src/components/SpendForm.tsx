'use client';

import React, { useState, useEffect } from 'react';

// Define the shape of our local form state
interface ToolState {
  enabled: boolean;
  plan: string;
  monthlySpend: number;
  seats: number;
}

const INITIAL_TOOL_STATE: ToolState = { enabled: false, plan: 'Pro', monthlySpend: 0, seats: 1 };

export default function SpendForm() {
  // Main form state capturing overall team context and tool breakdowns
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<string>('coding');
  const [tools, setTools] = useState<Record<string, ToolState>>({
    cursor: { ...INITIAL_TOOL_STATE, plan: 'Pro' },
    githubCopilot: { ...INITIAL_TOOL_STATE, plan: 'Individual' },
    claude: { ...INITIAL_TOOL_STATE, plan: 'Pro' },
    chatGpt: { ...INITIAL_TOOL_STATE, plan: 'Plus' },
    anthropicApi: { ...INITIAL_TOOL_STATE, plan: 'API direct' },
    openAiApi: { ...INITIAL_TOOL_STATE, plan: 'API direct' },
    gemini: { ...INITIAL_TOOL_STATE, plan: 'Pro' },
    windsurf: { ...INITIAL_TOOL_STATE, plan: 'Pro' },
  });

  // STATE PERSISTENCE ON PAGE RELOAD 
  // Hydrate state from localStorage on initial component mount
  useEffect(() => {
    const savedTeamSize = localStorage.getItem('audit_teamSize');
    const savedUseCase = localStorage.getItem('audit_useCase');
    const savedTools = localStorage.getItem('audit_tools');

    if (savedTeamSize) setTeamSize(Number(savedTeamSize));
    if (savedUseCase) setUseCase(savedUseCase);
    if (savedTools) setTools(JSON.parse(savedTools));
  }, []);

  // Synchronize state to localStorage whenever inputs change
  useEffect(() => {
    localStorage.setItem('audit_teamSize', teamSize.toString());
    localStorage.setItem('audit_useCase', useCase);
    localStorage.setItem('audit_tools', JSON.stringify(tools));
  }, [teamSize, useCase, tools]);

  const handleToolChange = (toolKey: string, field: keyof ToolState, value: any) => {
    setTools((prev) => ({
      ...prev,
      [toolKey]: { ...prev[toolKey], [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with persisted state:', { teamSize, useCase, tools });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">Baseline AI Stack Audit Input</h2>
      
      {/* Team Context Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-slate-950 rounded-lg border border-slate-800">
        <div>
          <label className="block text-sm font-semibold mb-2">Total Team Size</label>
          <input 
            type="number" 
            min="1"
            value={teamSize} 
            onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value)))}
            className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-white focus:outline-none focus:border-teal-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Primary Use Case</label>
          <select 
            value={useCase} 
            onChange={(e) => setUseCase(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-white focus:outline-none focus:border-teal-400"
          >
            <option value="coding">Coding / Development</option>
            <option value="writing">Writing / Marketing</option>
            <option value="data">Data Analysis / BI</option>
            <option value="research">Research & Development</option>
            <option value="mixed">Mixed Operations</option>
          </select>
        </div>
      </div>

      {/* Dynamic Tool Input Row Cards */}
      <h3 className="text-lg font-bold mb-4 text-slate-400">Select Active Stack Tools:</h3>
      <div className="space-y-4 mb-6">
        {Object.keys(tools).map((toolKey) => (
          <div key={toolKey} className={`p-4 rounded-lg border transition-all ${tools[toolKey].enabled ? 'bg-slate-950 border-teal-500/50' : 'bg-slate-950/40 border-slate-800'}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="flex items-center gap-3 font-semibold min-w-40 capitalize text-slate-200">
                <input 
                  type="checkbox" 
                  checked={tools[toolKey].enabled}
                  onChange={(e) => handleToolChange(toolKey, 'enabled', e.target.checked)}
                  className="w-4 h-4 rounded text-teal-500 focus:ring-0 bg-slate-800 border-slate-700"
                />
                {toolKey.replace(/([A-Z])/g, ' $1')}
              </label>

              {tools[toolKey].enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 animate-fadeIn">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Active Plan/Tier</label>
                    <input 
                      type="text"
                      value={tools[toolKey].plan}
                      onChange={(e) => handleToolChange(toolKey, 'plan', e.target.value)}
                      className="w-full p-1 text-sm bg-slate-800 rounded border border-slate-700 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Seats Allocated</label>
                    <input 
                      type="number"
                      min="1"
                      value={tools[toolKey].seats}
                      onChange={(e) => handleToolChange(toolKey, 'seats', Math.max(1, Number(e.target.value)))}
                      className="w-full p-1 text-sm bg-slate-800 rounded border border-slate-700 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Monthly Spend ($)</label>
                    <input 
                      type="number"
                      min="0"
                      value={tools[toolKey].monthlySpend}
                      onChange={(e) => handleToolChange(toolKey, 'monthlySpend', Math.max(0, Number(e.target.value)))}
                      className="w-full p-1 text-sm bg-slate-800 rounded border border-slate-700 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="w-full py-3 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition-colors font-bold rounded-lg text-slate-950 text-lg shadow-lg">
        Run Instataneous Audit Engine
      </button>
    </form>
  );
}