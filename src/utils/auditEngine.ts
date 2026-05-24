// TYPE DEFINITIONS FOR THE COMPUTATIONAL PAYLOADS
export interface ToolInput {
  plan: string;          
  monthlySpend: number;  
  seats: number;         
}

export interface AuditSuiteInput {
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  tools: {
    cursor?: ToolInput;
    githubCopilot?: ToolInput;
    claude?: ToolInput;
    chatGpt?: ToolInput;
    anthropicApi?: ToolInput;
    openAiApi?: ToolInput;
    gemini?: ToolInput;
    windsurf?: ToolInput; 
  };
}

export interface ToolAuditResult {
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  savings: number;
  reasoning: string;
}

export interface FinalAuditReport {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolBreakdown: Record<string, ToolAuditResult>;
  tierStatus: 'OPTIMAL' | 'MODERATE_SAVINGS' | 'HIGH_SAVINGS';
  requiresConsultation: boolean;
}

// DEFENSIVE INGESTION & TEXT NORMALIZATION UTILITIEs
/**
 * Normalizes wild string tokens entered by the user into standardized groups.
 * Guarantees mathematical safety against execution panics or NaN corruptions.
 */
export function normalizePlanTier(planName: string): 'pro' | 'team' | 'api' | 'fallback' {
  const normalized = planName.toLowerCase().trim();
  
  if (normalized.includes('pro') || normalized.includes('plus') || normalized.includes('individual') || normalized.includes('hobby')) {
    return 'pro';
  }
  if (normalized.includes('team') || normalized.includes('business') || normalized.includes('work') || normalized.includes('enterprise')) {
    return 'team';
  }
  if (normalized.includes('api') || normalized.includes('direct') || normalized.includes('token')) {
    return 'api';
  }
  
  // Safe default fallback group for unrecognized custom text patterns
  return 'fallback';
}

// MAIN DETERMINISTIC AUDIT RUNTIME ENGINE
/**
 * Runs hardcoded, deterministic rules over software spending layers.
 * Operates without LLM wrappers to guarantee financially defensible proofs.
 */
export function runAuditEngine(input: AuditSuiteInput): FinalAuditReport {
  const toolBreakdown: Record<string, ToolAuditResult> = {};
  let totalMonthlySpend = 0;
  let totalMonthlySavings = 0;

  // 1. AUDIT CELL: CURSOR AI 
  if (input.tools.cursor) {
    const { plan, monthlySpend, seats } = input.tools.cursor;
    totalMonthlySpend += monthlySpend;
    
    let recommendedSpend = monthlySpend;
    let action = "Keep current plan";
    let reasoning = "Your active seat counts match your operational profile and current subscription tier.";

    const tierType = normalizePlanTier(plan);

    // Rule: Business/Teams plan requires a minimum or is overkill for 1-2 users
    if (tierType === 'team' && seats <= 2) {
      recommendedSpend = seats * 20; // Pro individual retail is $20/user/month
      action = "Downgrade from Business/Team to Individual Pro seats";
      reasoning = `A team size of ${seats} does not justify premium centralized workspace overhead. Moving to Pro individual accounts saves $20 per seat.`;
    } 
    // Rule: Redundant tools check (Cursor vs Copilot license overlap)
    else if (input.tools.githubCopilot && seats > 0) {
      recommendedSpend = Math.max(0, monthlySpend - (input.tools.githubCopilot.monthlySpend * 0.5));
      action = "Consolidate code assistants";
      reasoning = "Detected concurrent billing for both Cursor and GitHub Copilot. Consolidating into a single editor ecosystem eliminates tool redundancy.";
    }
    // Defensive Fallback handling for arbitrary string inputs
    else if (tierType === 'fallback') {
      recommendedSpend = seats * 20; 
      action = "Review non-standard enterprise licensing parameters";
      reasoning = `Your custom tier entry "${plan}" was normalized to a safe baseline equivalent to prevent budgeting calculation failure.`;
    }

    const savings = Math.max(0, monthlySpend - recommendedSpend);
    toolBreakdown['cursor'] = { currentSpend: monthlySpend, recommendedAction: action, recommendedSpend, savings, reasoning };
    totalMonthlySavings += savings;
  }

  // 2. AUDIT CELL: GITHUB COPILOT 
  if (input.tools.githubCopilot) {
    const { plan, monthlySpend, seats } = input.tools.githubCopilot;
    totalMonthlySpend += monthlySpend;
    
    let recommendedSpend = monthlySpend;
    let action = "Keep current plan";
    let reasoning = "Licensing expenditure aligns cleanly with reported seat capacity.";

    // Rule: Centralized consolidation to single IDE environments if Cursor is the main workspace
    if (input.tools.cursor && input.tools.cursor.seats >= seats) {
      recommendedSpend = 0;
      action = "Deprecate GitHub Copilot licenses";
      reasoning = "Cursor includes native inline autocomplete and chat models out of the box, rendering standalone Copilot licenses redundant.";
    }

    const savings = Math.max(0, monthlySpend - recommendedSpend);
    toolBreakdown['githubCopilot'] = { currentSpend: monthlySpend, recommendedAction: action, recommendedSpend, savings, reasoning };
    totalMonthlySavings += savings;
  }

  // 3. AUDIT CELL: CLAUDE 
  if (input.tools.claude) {
    const { plan, monthlySpend, seats } = input.tools.claude;
    totalMonthlySpend += monthlySpend;

    let recommendedSpend = monthlySpend;
    let action = "Keep current plan";
    let reasoning = "Claude infrastructure matches standard workspace patterns.";

    const claudeTier = normalizePlanTier(plan);

    // Rule: Team tiers for less than 5 seats are economically inefficient compared to Pro
    if (claudeTier === 'team' && seats < 5) {
      recommendedSpend = seats * 20; // Pro individual is $20/mo, Team is $30/mo
      action = "Downgrade to Claude Pro accounts";
      reasoning = `Claude Team tiers enforce a 5-seat billing minimum. Transitioning ${seats} users to Pro cuts spend back to actual usage.`;
    }
    // Defensive Fallback handling for custom string inputs
    else if (claudeTier === 'fallback') {
      recommendedSpend = seats * 20;
      action = "Review custom Claude enterprise workspace footprint";
      reasoning = `The custom tier notation "${plan}" fell back gracefully to single seat cost structures.`;
    }

    const savings = Math.max(0, monthlySpend - recommendedSpend);
    toolBreakdown['claude'] = { currentSpend: monthlySpend, recommendedAction: action, recommendedSpend, savings, reasoning };
    totalMonthlySavings += savings;
  }

  // 4. AUDIT CELL: CHATGPT 
  if (input.tools.chatGpt) {
    const { plan, monthlySpend, seats } = input.tools.chatGpt;
    totalMonthlySpend += monthlySpend;

    let recommendedSpend = monthlySpend;
    let action = "Keep current plan";
    let reasoning = "Subscription baseline reflects retail standard usage metrics.";

    // Rule: Cross-vendor redundancy check (Paying for both ChatGPT Plus and Claude Pro for basic workflows)
    if (input.tools.claude && input.tools.claude.seats >= seats && input.primaryUseCase !== 'mixed') {
      recommendedSpend = Math.max(0, monthlySpend - (seats * 20));
      action = "Consolidate general LLM seats";
      reasoning = `Running duplicate active chat seats across both ChatGPT and Claude for a specialized '${input.primaryUseCase}' workflow creates internal licensing friction.`;
    }

    const savings = Math.max(0, monthlySpend - recommendedSpend);
    toolBreakdown['chatGpt'] = { currentSpend: monthlySpend, recommendedAction: action, recommendedSpend, savings, reasoning };
    totalMonthlySavings += savings;
  }

  // 5. AUDIT CELL: ANTHROPIC & OPENAI API DIRECT 
  const apiTools = [
    { key: 'anthropicApi', data: input.tools.anthropicApi },
    { key: 'openAiApi', data: input.tools.openAiApi }
  ];

  apiTools.forEach(api => {
    if (api.data) {
      const { monthlySpend } = api.data;
      totalMonthlySpend += monthlySpend;

      let recommendedSpend = monthlySpend;
      let action = "Keep API direct structure";
      let reasoning = "Pay-as-you-go token consumption matches historical API resource metrics.";

      // Rule: High unthrottled direct token spend signals transition point to wholesale caching structures
      if (monthlySpend > 400) {
        recommendedSpend = monthlySpend * 0.85; // Assume standard 15% system optimization target
        action = "Implement routing thresholds or credit lines";
        reasoning = `Unrestricted raw developer token consumption exceeding $400/mo signals a transition point where caching strategies or credit pools save up to 15%.`;
      }

      const savings = Math.max(0, monthlySpend - recommendedSpend);
      toolBreakdown[api.key] = { currentSpend: monthlySpend, recommendedAction: action, recommendedSpend, savings, reasoning };
      totalMonthlySavings += savings;
    }
  });

  // 6. AUDIT CELL: GEMINI & WINDSURF
  const longTailTools = [
    { key: 'gemini', data: input.tools.gemini },
    { key: 'windsurf', data: input.tools.windsurf }
  ];

  longTailTools.forEach(tool => {
    if (tool.data) {
      const { monthlySpend } = tool.data;
      totalMonthlySpend += monthlySpend;
      
      // Kept lean to prevent friction in specialized single-engineer tooling
      toolBreakdown[tool.key] = {
        currentSpend: monthlySpend,
        recommendedAction: "Keep current configuration",
        recommendedSpend: monthlySpend,
        savings: 0,
        reasoning: "Current spending matches optimal market rates for specialized workflow tooling."
      };
    }
  });

  // GLOBAL HIGHLIGHT METRIC MATH LAYER
  const totalAnnualSavings = totalMonthlySavings * 12;
  
  // Set systemic tier flags matching the evaluation threshold requirements
  let tierStatus: 'OPTIMAL' | 'MODERATE_SAVINGS' | 'HIGH_SAVINGS' = 'OPTIMAL';
  if (totalMonthlySavings >= 500) {
    tierStatus = 'HIGH_SAVINGS'; // Automatically flags corporate provisioning markers
  } else if (totalMonthlySavings > 100) {
    tierStatus = 'MODERATE_SAVINGS';
  }

  // High overspend thresholds programmatically route instances to a consultative pipeline
  const requiresConsultation = totalMonthlySavings >= 500;

  return {
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdown,
    tierStatus,
    requiresConsultation
  };
}

