'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { runAuditEngine, AuditSuiteInput, FinalAuditReport } from '@/utils/auditEngine';

interface ToolState {
  enabled: boolean;
  plan: string;
  monthlySpend: number;
  seats: number;
}

const INITIAL_TOOL_STATE: ToolState = { enabled: false, plan: 'Pro', monthlySpend: 0, seats: 1 };

export default function SpendForm() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<string>('coding');
  
  // State to hold the computed report metrics
  const [report, setReport] = useState<FinalAuditReport | null>(null);

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

  useEffect(() => {
    const savedTeamSize = localStorage.getItem('audit_teamSize');
    const savedUseCase = localStorage.getItem('audit_useCase');
    const savedTools = localStorage.getItem('audit_tools');

    if (savedTeamSize) setTeamSize(Number(savedTeamSize));
    if (savedUseCase) setUseCase(savedUseCase);
    if (savedTools) setTools(JSON.parse(savedTools));

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('audit_teamSize', teamSize.toString());
      localStorage.setItem('audit_useCase', useCase);
      localStorage.setItem('audit_tools', JSON.stringify(tools));
    }
  }, [teamSize, useCase, tools, mounted]);

  const handleToolChange = (toolKey: string, field: keyof ToolState, value: any) => {
    setTools((prev) => ({
      ...prev,
      [toolKey]: { ...prev[toolKey], [field]: value },
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auditPayload: AuditSuiteInput = {
      teamSize,
      primaryUseCase: useCase as 'coding' | 'writing' | 'data' | 'research' | 'mixed',
      tools: {
        cursor: tools.cursor.enabled ? { plan: tools.cursor.plan, monthlySpend: tools.cursor.monthlySpend, seats: tools.cursor.seats } : undefined,
        githubCopilot: tools.githubCopilot.enabled ? { plan: tools.githubCopilot.plan, monthlySpend: tools.githubCopilot.monthlySpend, seats: tools.githubCopilot.seats } : undefined,
        claude: tools.claude.enabled ? { plan: tools.claude.plan, monthlySpend: tools.claude.monthlySpend, seats: tools.claude.seats } : undefined,
        chatGpt: tools.chatGpt.enabled ? { plan: tools.chatGpt.plan, monthlySpend: tools.chatGpt.monthlySpend, seats: tools.chatGpt.seats } : undefined,
        anthropicApi: tools.anthropicApi.enabled ? { plan: tools.anthropicApi.plan, monthlySpend: tools.anthropicApi.monthlySpend, seats: tools.anthropicApi.seats } : undefined,
        openAiApi: tools.openAiApi.enabled ? { plan: tools.openAiApi.plan, monthlySpend: tools.openAiApi.monthlySpend, seats: tools.openAiApi.seats } : undefined,
        gemini: tools.gemini.enabled ? { plan: tools.gemini.plan, monthlySpend: tools.gemini.monthlySpend, seats: tools.gemini.seats } : undefined,
        windsurf: tools.windsurf.enabled ? { plan: tools.windsurf.plan, monthlySpend: tools.windsurf.monthlySpend, seats: tools.windsurf.seats } : undefined,
      }
    };

    const finalReport = runAuditEngine(auditPayload);
    setReport(finalReport);
  };

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-slate-900 text-slate-400 rounded-xl shadow-md border border-slate-800 text-center py-12">
        <p className="animate-pulse font-medium text-teal-400">Initializing secure financial workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. AUDIT FORM INPUT CONTAINER */}
      <form 
        onSubmit={handleSubmit} 
        suppressHydrationWarning={true}
        className="max-w-4xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800"
      >
        <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
          <span>📋</span> Stack Configuration Inputs
        </h2>
        
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

        <h3 className="text-base font-bold mb-4 text-slate-400">Select Active Stack Tools:</h3>
        <div className="space-y-4 mb-6">
          {Object.keys(tools).map((toolKey) => (
            <div key={toolKey} className={`p-4 rounded-lg border transition-all ${tools[toolKey].enabled ? 'bg-slate-950 border-teal-500/50' : 'bg-slate-950/40 border-slate-800'}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="flex items-center gap-3 font-semibold min-w-40 capitalize text-slate-200 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tools[toolKey].enabled}
                    onChange={(e) => handleToolChange(toolKey, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                  {toolKey.replace(/([A-Z])/g, ' $1')}
                </label>

                {tools[toolKey].enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
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

        <button 
          type="submit" 
          suppressHydrationWarning={true}
          className="w-full py-3 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition-colors font-bold rounded-lg text-slate-950 text-lg shadow-lg"
        >
          Evaluate Financial Efficiency
        </button>
      </form>

      {/* 2. DYNAMIC REAL-TIME RESULTS DASHBOARD COMPONENT */}
      {report && (
        <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-8 animate-fadeIn">
          
          {/* Main Hero Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Monthly Spend</p>
              <p className="text-2xl font-black text-slate-200 mt-1">${report.totalMonthlySpend}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-teal-500/20 ring-1 ring-teal-500/10">
              <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">Target Monthly Savings</p>
              <p className="text-3xl font-black text-teal-400 mt-1">${report.totalMonthlySavings}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected Annual Savings</p>
              <p className="text-2xl font-black text-teal-500 mt-1">${report.totalAnnualSavings}</p>
            </div>
          </div>

          {/* Efficiency Status Row Banner */}
          <div className="p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800">
            <div>
              <h4 className="font-bold text-base text-slate-200">System Optimization Status</h4>
              <p className="text-xs text-slate-400 mt-0.5">Calculated using live deterministic SaaS pricing boundaries.</p>
            </div>
            <div>
              {report.tierStatus === 'HIGH_SAVINGS' && (
                <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider rounded">
                  ⚠️ Critical Overspend Detected
                </span>
              )}
              {report.tierStatus === 'MODERATE_SAVINGS' && (
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider rounded">
                  📈 Optimization Opportunities
                </span>
              )}
              {report.tierStatus === 'OPTIMAL' && (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded">
                  ✅ Stack Lean & Optimal
                </span>
              )}
            </div>
          </div>

          {/* Granular Per-Tool Analysis Rows */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Per-Tool Fiscal Analysis</h4>
            {Object.entries(report.toolBreakdown).map(([toolKey, result]) => (
              <div key={toolKey} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="font-bold capitalize text-slate-200">{toolKey.replace(/([A-Z])/g, ' $1')}</span>
                  {result.savings > 0 ? (
                    <span className="text-xs font-medium text-rose-400">Bleeding ${result.savings}/mo</span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-400">Fully Optimized</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block">Recommended Strategy:</span>
                    <span className="font-medium text-slate-300">{result.recommendedAction}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Target Budget Floor:</span>
                    <span className="font-medium text-slate-300">${result.recommendedSpend} / mo</span>
                  </div>
                  <div className="md:col-span-1">
                    <span className="text-xs text-slate-500 block">Financial Architecture Proof:</span>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{result.reasoning}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. OPTIONAL FEATURE REQUIREMENT: CONDITIONAL CREDEX CONSULTATION BANNER */}
          {report.requiresConsultation && (
            <div className="p-5 bg-linear-to-r from-teal-950/40 to-slate-900 rounded-xl border border-teal-500/30 space-y-3 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-0.5">🚀</div>
                <div>
                  <h4 className="font-extrabold text-teal-400 text-base">Unlock Corporate Infrastructure Routing Lines</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Your aggregate team overspend qualifies for personalized wholesale provisioning. By routing core operations through Credex high-savings pipelines, your organization drops fixed licensing overhead entirely in favor of subsidized high-volume tokens.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button 
                  type="button"
                  onClick={() => alert('Routing parameters submitted to Credex provisioning team.')}
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md"
                >
                  Request Institutional Audit Review
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}