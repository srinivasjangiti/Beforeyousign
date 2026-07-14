// Contract version comparison utilities

import { ContractAnalysis, ClauseAnalysis, RedFlag } from './types';

export interface ComparisonResult {
  oldVersion: ContractAnalysis;
  newVersion: ContractAnalysis;
  riskScoreChange: {
    old: number;
    new: number;
    delta: number;
    direction: 'improved' | 'worsened' | 'unchanged';
  };
  clauseChanges: ClauseChange[];
  redFlagChanges: RedFlagChange[];
  summary: string;
  recommendations: string[];
}

export interface ClauseChange {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  oldClause?: ClauseAnalysis;
  newClause?: ClauseAnalysis;
  riskChange?: {
    old: string;
    new: string;
    direction: 'improved' | 'worsened' | 'unchanged';
  };
  textDiff?: {
    additions: string[];
    deletions: string[];
    modifications: string[];
  };
  significance: 'critical' | 'high' | 'medium' | 'low';
}

export interface RedFlagChange {
  type: 'added' | 'removed' | 'resolved';
  redFlag: RedFlag;
  explanation: string;
}

/**
 * Compare two contract analyses and identify changes
 */
export function compareContracts(
  oldAnalysis: ContractAnalysis,
  newAnalysis: ContractAnalysis
): ComparisonResult {
  const riskScoreChange = calculateRiskScoreChange(oldAnalysis, newAnalysis);
  const clauseChanges = compareClause(oldAnalysis.clauses, newAnalysis.clauses);
  const redFlagChanges = compareRedFlags(oldAnalysis.redFlags, newAnalysis.redFlags);
  const summary = generateComparisonSummary(riskScoreChange, clauseChanges, redFlagChanges);
  const recommendations = generateComparisonRecommendations(clauseChanges, redFlagChanges);

  return {
    oldVersion: oldAnalysis,
    newVersion: newAnalysis,
    riskScoreChange,
    clauseChanges,
    redFlagChanges,
    summary,
    recommendations,
  };
}

function calculateRiskScoreChange(
  oldAnalysis: ContractAnalysis,
  newAnalysis: ContractAnalysis
) {
  const delta = newAnalysis.riskScore - oldAnalysis.riskScore;
  let direction: 'improved' | 'worsened' | 'unchanged';

  if (delta < -5) direction = 'improved';
  else if (delta > 5) direction = 'worsened';
  else direction = 'unchanged';

  return {
    old: oldAnalysis.riskScore,
    new: newAnalysis.riskScore,
    delta,
    direction,
  };
}

function compareClause(
  oldClauses: ClauseAnalysis[],
  newClauses: ClauseAnalysis[]
): ClauseChange[] {
  const changes: ClauseChange[] = [];
  const oldClauseMap = new Map(oldClauses.map(c => [c.title, c]));
  const newClauseMap = new Map(newClauses.map(c => [c.title, c]));
  const allTitles = new Set([...oldClauseMap.keys(), ...newClauseMap.keys()]);

  for (const title of allTitles) {
    const oldClause = oldClauseMap.get(title);
    const newClause = newClauseMap.get(title);

    if (!oldClause && newClause) {
      // New clause added
      changes.push({
        type: 'added',
        newClause,
        significance: getRiskLevelSignificance(newClause.riskLevel),
      });
    } else if (oldClause && !newClause) {
      // Clause removed
      changes.push({
        type: 'removed',
        oldClause,
        significance: getRiskLevelSignificance(oldClause.riskLevel),
      });
    } else if (oldClause && newClause) {
      // Check if modified
      const textChanged = oldClause.originalText !== newClause.originalText;
      const riskChanged = oldClause.riskLevel !== newClause.riskLevel;

      if (textChanged || riskChanged) {
        const textDiff = calculateTextDiff(oldClause.originalText, newClause.originalText);
        
        const riskLevels = ['low', 'medium', 'high', 'critical'] as const;
        const oldRiskIndex = riskLevels.indexOf(oldClause.riskLevel);
        const newRiskIndex = riskLevels.indexOf(newClause.riskLevel);
        const maxRiskIndex = Math.max(oldRiskIndex, newRiskIndex);
        
        changes.push({
          type: 'modified',
          oldClause,
          newClause,
          riskChange: riskChanged ? {
            old: oldClause.riskLevel,
            new: newClause.riskLevel,
            direction: getRiskChangeDirection(oldClause.riskLevel, newClause.riskLevel),
          } : undefined,
          textDiff: textChanged ? textDiff : undefined,
          significance: riskLevels[maxRiskIndex],
        });
      } else {
        changes.push({
          type: 'unchanged',
          oldClause,
          newClause,
          significance: 'low',
        });
      }
    }
  }

  return changes.sort((a, b) => {
    const sigOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return sigOrder[a.significance] - sigOrder[b.significance];
  });
}

function compareRedFlags(oldFlags: RedFlag[], newFlags: RedFlag[]): RedFlagChange[] {
  const changes: RedFlagChange[] = [];
  const oldFlagMap = new Map(oldFlags.map(f => [f.type + f.title, f]));
  const newFlagMap = new Map(newFlags.map(f => [f.type + f.title, f]));
  const allKeys = new Set([...oldFlagMap.keys(), ...newFlagMap.keys()]);

  for (const key of allKeys) {
    const oldFlag = oldFlagMap.get(key);
    const newFlag = newFlagMap.get(key);

    if (!oldFlag && newFlag) {
      changes.push({
        type: 'added',
        redFlag: newFlag,
        explanation: `New ${newFlag.severity} issue: ${newFlag.title}`,
      });
    } else if (oldFlag && !newFlag) {
      changes.push({
        type: 'resolved',
        redFlag: oldFlag,
        explanation: `Previously flagged ${oldFlag.severity} issue has been addressed`,
      });
    }
  }

  return changes;
}

function calculateTextDiff(oldText: string, newText: string) {
  // Simple word-based diff
  const oldWords = oldText.split(/\s+/);
  const newWords = newText.split(/\s+/);
  
  const additions: string[] = [];
  const deletions: string[] = [];
  const modifications: string[] = [];

  // Very basic diff - in production, use a proper diff library
  if (oldWords.length !== newWords.length) {
    modifications.push(`Length changed from ${oldWords.length} to ${newWords.length} words`);
  }

  // Look for significant word changes
  const oldSet = new Set(oldWords.map(w => w.toLowerCase()));
  const newSet = new Set(newWords.map(w => w.toLowerCase()));

  for (const word of newSet) {
    if (!oldSet.has(word) && word.length > 4) {
      additions.push(word);
    }
  }

  for (const word of oldSet) {
    if (!newSet.has(word) && word.length > 4) {
      deletions.push(word);
    }
  }

  return {
    additions: additions.slice(0, 10), // Limit to top 10
    deletions: deletions.slice(0, 10),
    modifications,
  };
}

function getRiskLevelSignificance(level: 'low' | 'medium' | 'high' | 'critical'): 'critical' | 'high' | 'medium' | 'low' {
  return level;
}

function getRiskChangeDirection(
  oldLevel: string,
  newLevel: string
): 'improved' | 'worsened' | 'unchanged' {
  const order = { low: 0, medium: 1, high: 2, critical: 3 };
  const oldScore = order[oldLevel as keyof typeof order] || 0;
  const newScore = order[newLevel as keyof typeof order] || 0;

  if (newScore < oldScore) return 'improved';
  if (newScore > oldScore) return 'worsened';
  return 'unchanged';
}

function generateComparisonSummary(
  riskChange: ComparisonResult['riskScoreChange'],
  clauseChanges: ClauseChange[],
  redFlagChanges: RedFlagChange[]
): string {
  const added = clauseChanges.filter(c => c.type === 'added').length;
  const removed = clauseChanges.filter(c => c.type === 'removed').length;
  const modified = clauseChanges.filter(c => c.type === 'modified').length;
  const flagsAdded = redFlagChanges.filter(c => c.type === 'added').length;
  const flagsResolved = redFlagChanges.filter(c => c.type === 'resolved').length;

  let summary = `Contract version comparison shows ${modified} modified clause${modified !== 1 ? 's' : ''}, `;
  summary += `${added} added, and ${removed} removed. `;
  summary += `Overall risk score ${riskChange.direction === 'improved' ? 'improved' : riskChange.direction === 'worsened' ? 'worsened' : 'remained stable'} `;
  summary += `(${riskChange.old} → ${riskChange.new}, ${riskChange.delta > 0 ? '+' : ''}${riskChange.delta} points). `;
  
  if (flagsResolved > 0) {
    summary += `Good news: ${flagsResolved} red flag${flagsResolved !== 1 ? 's' : ''} resolved. `;
  }
  
  if (flagsAdded > 0) {
    summary += `Caution: ${flagsAdded} new red flag${flagsAdded !== 1 ? 's' : ''} introduced.`;
  }

  return summary;
}

function generateComparisonRecommendations(
  clauseChanges: ClauseChange[],
  redFlagChanges: RedFlagChange[]
): string[] {
  const recommendations: string[] = [];

  // Check for worsened clauses
  const worsenedClauses = clauseChanges.filter(
    c => c.type === 'modified' && c.riskChange?.direction === 'worsened'
  );
  
  if (worsenedClauses.length > 0) {
    recommendations.push(
      `⚠️ ${worsenedClauses.length} clause${worsenedClauses.length !== 1 ? 's' : ''} became more risky - review carefully: ${worsenedClauses.map(c => c.newClause?.title).slice(0, 3).join(', ')}`
    );
  }

  // Check for new red flags
  const newRedFlags = redFlagChanges.filter(c => c.type === 'added');
  if (newRedFlags.length > 0) {
    recommendations.push(
      `🚨 ${newRedFlags.length} new red flag${newRedFlags.length !== 1 ? 's' : ''} introduced - address immediately`
    );
  }

  // Check for resolved issues
  const resolved = redFlagChanges.filter(c => c.type === 'resolved');
  if (resolved.length > 0) {
    recommendations.push(
      `✅ ${resolved.length} previous issue${resolved.length !== 1 ? 's' : ''} successfully resolved`
    );
  }

  // Check for new critical clauses
  const newCritical = clauseChanges.filter(
    c => c.type === 'added' && c.newClause?.riskLevel === 'critical'
  );
  if (newCritical.length > 0) {
    recommendations.push(
      `🔴 ${newCritical.length} new critical clause${newCritical.length !== 1 ? 's' : ''} added - negotiate before signing`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('✨ Changes appear reasonable - review modified clauses for final approval');
  }

  return recommendations;
}

/**
 * Generate a detailed comparison report in markdown
 */
export function generateComparisonReport(comparison: ComparisonResult): string {
  let report = `# Contract Version Comparison Report\n\n`;
  report += `*Generated: ${new Date().toLocaleString()}*\n\n`;
  report += `---\n\n`;

  // Executive Summary
  report += `## Executive Summary\n\n`;
  report += `${comparison.summary}\n\n`;
  report += `### Risk Score Change\n\n`;
  report += `- **Previous Version:** ${comparison.riskScoreChange.old}/100\n`;
  report += `- **New Version:** ${comparison.riskScoreChange.new}/100\n`;
  report += `- **Change:** ${comparison.riskScoreChange.delta > 0 ? '+' : ''}${comparison.riskScoreChange.delta} points\n`;
  report += `- **Assessment:** ${comparison.riskScoreChange.direction === 'improved' ? '✅ Improved' : comparison.riskScoreChange.direction === 'worsened' ? '⚠️ Worsened' : '➡️ Unchanged'}\n\n`;

  // Recommendations
  report += `## Key Recommendations\n\n`;
  comparison.recommendations.forEach((rec, i) => {
    report += `${i + 1}. ${rec}\n`;
  });
  report += `\n---\n\n`;

  // Red Flag Changes
  if (comparison.redFlagChanges.length > 0) {
    report += `## Red Flag Changes\n\n`;
    comparison.redFlagChanges.forEach(change => {
      const emoji = change.type === 'added' ? '🆕' : '✅';
      report += `### ${emoji} ${change.type.toUpperCase()}: ${change.redFlag.title}\n\n`;
      report += `**Severity:** ${change.redFlag.severity}\n\n`;
      report += `${change.explanation}\n\n`;
      report += `**Description:** ${change.redFlag.description}\n\n`;
    });
    report += `---\n\n`;
  }

  // Clause Changes
  report += `## Detailed Clause Changes\n\n`;
  const significantChanges = comparison.clauseChanges.filter(
    c => c.type !== 'unchanged' && (c.significance === 'critical' || c.significance === 'high')
  );

  if (significantChanges.length > 0) {
    significantChanges.forEach((change, i) => {
      report += `### ${i + 1}. ${change.type.toUpperCase()}: ${change.newClause?.title || change.oldClause?.title}\n\n`;
      report += `**Significance:** ${change.significance.toUpperCase()}\n\n`;

      if (change.riskChange) {
        report += `**Risk Change:** ${change.riskChange.old} → ${change.riskChange.new} (${change.riskChange.direction})\n\n`;
      }

      if (change.type === 'modified' && change.textDiff) {
        if (change.textDiff.additions.length > 0) {
          report += `**Key Additions:** ${change.textDiff.additions.join(', ')}\n\n`;
        }
        if (change.textDiff.deletions.length > 0) {
          report += `**Key Deletions:** ${change.textDiff.deletions.join(', ')}\n\n`;
        }
      }

      if (change.newClause) {
        report += `**Current Language:**\n\n${change.newClause.plainLanguage}\n\n`;
      }

      report += `---\n\n`;
    });
  } else {
    report += `*No significant clause changes detected.*\n\n`;
  }

  return report;
}
