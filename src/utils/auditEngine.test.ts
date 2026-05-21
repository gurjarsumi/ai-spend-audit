import { describe, test, expect } from 'vitest';
import { runAuditEngine, AuditSuiteInput } from './auditEngine';

describe('AI Spend Audit Engine Verification Suite', () => {

  // Test 1: Verifies overspend flagging on small teams using premium configurations
  test('should flag Cursor Team plan as overkill for a single user and calculate accurate savings', () => {
    const mockInput: AuditSuiteInput = {
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: {
        cursor: { plan: 'team', monthlySpend: 40, seats: 1 }
      }
    };

    const report = runAuditEngine(mockInput);
    
    expect(report.totalMonthlySpend).toBe(40);
    expect(report.totalMonthlySavings).toBe(20); // Down to Pro ($20)
    expect(report.totalAnnualSavings).toBe(240);
    expect(report.toolBreakdown.cursor.recommendedActions).toContain('Downgrade');
  });

  // Test 2: Verifies structural redundancy detection across overlapping tool classes
  test('should deprecate GitHub Copilot entirely if concurrent Cursor seats are active', () => {
    const mockInput: AuditSuiteInput = {
      teamSize: 3,
      primaryUseCase: 'coding',
      tools: {
        cursor: { plan: 'team', monthlySpend: 120, seats: 3 },
        githubCopilot: { plan: 'business', monthlySpend: 57, seats: 3 }
      }
    };

    const report = runAuditEngine(mockInput);

    expect(report.toolBreakdown.githubCopilot.recommendedSpend).toBe(0);
    expect(report.toolBreakdown.githubCopilot.savings).toBe(57);
    expect(report.toolBreakdown.githubCopilot.recommendedActions).toContain('Deprecate');
  });

  // Test 3: Verifies vendor floor inefficiencies (e.g., Claude minimum seat boundaries)
  test('should recommend downgrading Claude Team tier to individual Pro accounts if seats < 5', () => {
    const mockInput: AuditSuiteInput = {
      teamSize: 3,
      primaryUseCase: 'mixed',
      tools: {
        claude: { plan: 'team', monthlySpend: 90, seats: 3 }
      }
    };

    const report = runAuditEngine(mockInput);

    expect(report.toolBreakdown.claude.recommendedSpend).toBe(60); // 3 * $20 Pro
    expect(report.toolBreakdown.claude.savings).toBe(30);
  });

  // Test 4: Verifies the high-tier savings routing rules ($500+ threshold)
  test('should flag high savings tier and trigger consulting requirements if monthly savings >= $500', () => {
    const mockInput: AuditSuiteInput = {
      teamSize: 30,
      primaryUseCase: 'coding',
      tools: {
        cursor: { plan: 'team', monthlySpend: 1200, seats: 30 },
        githubCopilot: { plan: 'business', monthlySpend: 570, seats: 30 }
      }
    };

    const report = runAuditEngine(mockInput);

    expect(report.totalMonthlySavings).toBeGreaterThanOrEqual(500);
    expect(report.tierStatus).toBe('HIGH_SAVINGS');
    expect(report.requiresConsultation).toBe(true);
  });

  // Test 5: Verifies honest reporting compliance on optimal stacks
  test('should display an optimal status and manufacture zero fake savings if stack is already streamlined', () => {
    const mockInput: AuditSuiteInput = {
      teamSize: 2,
      primaryUseCase: 'research',
      tools: {
        gemini: { plan: 'pro', monthlySpend: 0, seats: 2 }
      }
    };

    const report = runAuditEngine(mockInput);

    expect(report.totalMonthlySavings).toBe(0);
    expect(report.tierStatus).toBe('OPTIMAL');
    expect(report.requiresConsultation).toBe(false);
  });
});