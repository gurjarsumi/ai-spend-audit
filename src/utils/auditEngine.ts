// Type definitions for form state data
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
        chatgpt?: ToolInput;
        anthropicApi?: ToolInput;
        openAiApi?: ToolInput;
        gemini?: ToolInput;
        windsurf?: ToolInput;
    };
}

export interface ToolAuditResult {
    currentSpend: number;
    recommendedActions: string;
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

/** 
 * Audit Engine: Runs deterministic, financially defensible rules over AI tool spending.
 * Hardcoded rules prevent LLM hallucination in calculations.
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

        // Logic: Business/Team plan requires a minimum or is overkill for 1-2 users
        if ((plan.toLowerCase() === 'business' || plan.toLowerCase() === 'team' || plan.toLowerCase() === 'teams') && seats <= 2) {
            // Pro individual is $20/user/month, Business/Team is typically $40/user/month
            recommendedSpend = seats * 20;
            action = "Downgrade from Business/Team to Individual Pro";
            reasoning = "A team size of ${seats} does not justify centralized workspcace overhead. Moving to pro individual accounts saves $20 per seat.";

        }
        // Logic: Redundant tools check (Cursor vs Coplilot license overlap)
        else if (input.tools.githubCopilot && seats > 0) {
            recommendedSpend = Math.max(0, monthlySpend - (input.tools.githubCopilot.monthlySpend * 0.5));
            action = "Consolidate code assistants";
            reasoning = "Detected concurrent billing for Cursor and GitHub Copilot. Consolidating into a single editor ecosystem eliminates tool redundancy.";
        }

        const savings = Math.max(0, monthlySpend - recommendedSpend);
        toolBreakdown['cursor'] = { currentSpend: monthlySpend, recommendedActions: action, recommendedSpend, savings, reasoning };
        totalMonthlySavings += savings;
    }

    // 2. AUDIT CELL: GITHUB COPILOT
    if (input.tools.githubCopilot) {
        const { plan, monthlySpend, seats } = input.tools.githubCopilot;
        totalMonthlySpend += monthlySpend;

        let recommendedSpend = monthlySpend;
        let action = "Keep current plan";
        let reasoning = "Licensing expenditure aligns cleanly with reported seat capacity.";

        // Logic: Centralized consolidation to single IDE environment if cursor is the main workspace
        if (input.tools.cursor && input.tools.cursor.seats >= seats) {
            recommendedSpend = 0;
            action = "Deprecate GitHub Copilot licenses";
            reasoning = "Cursor inlcudes native inline autocomplete and chat models out of the box, rendering stanalone copilot licenses redundant.";
        }

        const savings = Math.max(0, monthlySpend - recommendedSpend);
        toolBreakdown['githubCopilot'] = { currentSpend: monthlySpend, recommendedActions: action, recommendedSpend, savings: savings, reasoning };
        totalMonthlySavings += savings;

    }

    // 3. AUDIT CELL: CLAUDE
    if (input.tools.claude) {
        const { plan, monthlySpend, seats } = input.tools.claude;
        totalMonthlySpend += monthlySpend;

        let recommendedSpend = monthlySpend;
        let action = "Keep current plan";
        let reasoning = "Claude infrastructure matches standard workspace patterns.";

        // Logic: Team tiers for less than 5 seats are ecomnically inefficient compared to Pro
        if (plan.toLowerCase() === 'team' && seats < 5) {
            recommendedSpend = seats * 20;
            action = "Downgrade to Claude Pro accounts";
            reasoning = "Claude Teams tiers enforce a 5-seat billing minimum or add a premium. Transitioning ${seats} users to Pro cuts spend back to actual usage.";
        }

        const savings = Math.max(0, monthlySpend - recommendedSpend);
        toolBreakdown['claude'] = { currentSpend: monthlySpend, recommendedActions: action, recommendedSpend, savings, reasoning };
        totalMonthlySavings += savings;
    }

    // 4. AUDIT CELL: CHATGPT
    if (input.tools.chatgpt) {
        const { plan, monthlySpend, seats } = input.tools.chatgpt;
        totalMonthlySpend += monthlySpend;

        let recommendedSpend = monthlySpend;
        let action = "Keep current plan";
        let reasoning = "Subscription baseline reflects retail standard usage metrics.";

        // Logic: Cross-vendor redundancy check (Paying for both ChatGPT Plus and Claude Pro for basic workflow)
        if (input.tools.claude && input.tools.claude.seats >= seats && input.primaryUseCase !== 'mixed') {
            recommendedSpend = Math.max(0, monthlySpend - (seats * 20));
            action = "Consolidate genral LLM seats";
            reasoning = "Running duplicate active chat seats across both ChatGPT and Claude for a specialized '${input.primaryUseCase}' workflow creates internal licensing friction.";

        }

        const savings = Math.max(0, monthlySpend - recommendedSpend);
        toolBreakdown['chatgpt'] = { currentSpend: monthlySpend, recommendedActions: action, recommendedSpend, savings, reasoning };
        totalMonthlySavings += savings;
    }

    // 5. AUDIT CELL: ANTHROPIC API & OPENAI API DIRECT
    const apiTools = [
        { key: 'anthropicAPi', data: input.tools.anthropicApi },
        { key: 'openAiApi', data: input.tools.openAiApi }
    ];
    apiTools.forEach(api => {
        if (api.data) {
            const { monthlySpend, seats } = api.data;
            totalMonthlySpend += monthlySpend;

            let recommendedSpend = monthlySpend;
            let action = "Keep API direct structure";
            let reasoning = "Pay-as-you-go token consumption matches API resource metrics.";

            // Logic: Unthrottled direct API spend can often be routing raw text or development scripts that are cheap when channeled through  customized bulk models or credit lines
            if (monthlySpend > 400) {
                recommendedSpend = monthlySpend * 0.05;
                action = "Implement routing thresholds or credit lines";
                reasoning = `Unrestricted raw developer token consumption exceeding $400/mo signals a transtion point where caching strategies or credit pools save up to 15%.`
            }

            const savings = Math.max(0, monthlySpend - recommendedSpend);
            toolBreakdown[api.key] = { currentSpend: monthlySpend, recommendedActions: action, recommendedSpend, savings, reasoning };
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
            const { monthlySpend, seats } = tool.data;
            totalMonthlySpend += monthlySpend;

            // Default fallback for optimized baseline raws
            toolBreakdown[tool.key] = {
                currentSpend: monthlySpend,
                recommendedActions: "Keep current configuration",
                recommendedSpend: monthlySpend,
                savings: 0,
                reasoning: "Current spending matches optimal rates for specialized workflow tooling."
            };
        }
    });

    // 7. GLOBAL HIGHLIGHTS MATRICS
    const totalAnnualSavings = totalMonthlySavings * 12;

    // Set tier evaluation flags exactly as specified by the assignment bounds
    let tierStatus: 'OPTIMAL' | 'MODERATE_SAVINGS' | 'HIGH_SAVINGS' = 'OPTIMAL';
    if (totalMonthlySavings >= 500) {
        tierStatus = "HIGH_SAVINGS";
    }
    else if (totalMonthlySavings > 0) {
        tierStatus = "MODERATE_SAVINGS";
    }

    // High-savings automatically signal sales consultation route
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

 




















