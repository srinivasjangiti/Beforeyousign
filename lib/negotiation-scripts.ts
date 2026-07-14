// Negotiation script generator using NVIDIA NIM API

import { generateText, parseJsonResponse } from './nvidia-client';
import type { ContractClause } from './types';

export interface NegotiationScript {
  emailTemplate: string;
  talkingPoints: string[];
  negotiationStrategies: string[];
  alternativeLanguage: string;
  priorityLevel: 'Must Change' | 'Should Change' | 'Nice to Change';
}

/**
 * Generate negotiation scripts for a specific clause
 */
export async function generateNegotiationScript(
  clause: ContractClause,
  contractContext: string
): Promise<NegotiationScript> {
  const prompt = `You are an expert contract negotiation advisor. Generate a comprehensive negotiation script for the following contract clause.

**Clause Information:**
- Title: ${clause.title}
- Original Text: ${clause.originalText}
- Plain Language: ${clause.plainLanguage}
- Risk Level: ${clause.riskLevel}
- Concerns: ${clause.concerns.join(', ')}
- Recommendation: ${clause.recommendation}

**Contract Context:**
${contractContext}

Generate a negotiation script in JSON format with the following structure:
{
  "emailTemplate": "Professional email template to request changes (200-300 words, includes greeting, issue explanation, proposed solution, and closing)",
  "talkingPoints": ["Point 1", "Point 2", "Point 3", ...] (5-7 concise points for verbal negotiation),
  "negotiationStrategies": ["Strategy 1", "Strategy 2", ...] (3-5 tactical approaches),
  "alternativeLanguage": "Specific suggested replacement text for this clause",
  "priorityLevel": "Must Change" | "Should Change" | "Nice to Change"
}

**Guidelines:**
- Email should be professional, assertive but collaborative
- Talking points should be clear, fact-based arguments
- Strategies should be practical and relationship-preserving
- Alternative language should be fair to both parties
- Priority level based on risk severity

Return ONLY valid JSON, no additional text.`;

  try {
    const text = await generateText(prompt, undefined, 0.7, 4096);
    const script = parseJsonResponse<NegotiationScript>(text);
    
    if (!script.emailTemplate || !script.talkingPoints || !script.negotiationStrategies) {
      throw new Error('Invalid script format');
    }
    
    return script;
  } catch (error) {
    console.error('Error generating negotiation script:', error);
    
    // Fallback script
    return {
      emailTemplate: generateFallbackEmail(clause),
      talkingPoints: generateFallbackTalkingPoints(clause),
      negotiationStrategies: generateFallbackStrategies(clause),
      alternativeLanguage: `[Suggested revision for: ${clause.title}]\n\nThis clause should be modified to address the following concerns: ${clause.concerns.join(', ')}. We propose more balanced language that protects both parties' interests.`,
      priorityLevel: clause.riskLevel === 'critical' || clause.riskLevel === 'high' 
        ? 'Must Change' 
        : clause.riskLevel === 'medium' 
        ? 'Should Change' 
        : 'Nice to Change',
    };
  }
}

/**
 * Generate negotiation scripts for multiple clauses (batch)
 */
export async function generateBatchNegotiationScripts(
  clauses: ContractClause[],
  contractContext: string
): Promise<Map<string, NegotiationScript>> {
  const scripts = new Map<string, NegotiationScript>();
  
  // Process critical and high-risk clauses only
  const priorityClauses = clauses.filter(
    (c) => c.riskLevel === 'critical' || c.riskLevel === 'high'
  );

  // Process in batches to avoid rate limits
  const batchSize = 3;
  for (let i = 0; i < priorityClauses.length; i += batchSize) {
    const batch = priorityClauses.slice(i, i + batchSize);
    const batchPromises = batch.map((clause) =>
      generateNegotiationScript(clause, contractContext)
        .then((script) => ({ clauseTitle: clause.title, script }))
    );

    const results = await Promise.allSettled(batchPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        scripts.set(result.value.clauseTitle, result.value.script);
      }
    });

    // Small delay between batches
    if (i + batchSize < priorityClauses.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return scripts;
}

// Fallback functions for when AI generation fails

function generateFallbackEmail(clause: ContractClause): string {
  return `Subject: Request to Revise ${clause.title}

Dear [Recipient],

I hope this email finds you well. I am writing to discuss a concern regarding the "${clause.title}" section of our agreement.

**Current Concern:**
${clause.concerns[0] || 'The current language may create an imbalance in our agreement.'}

**Proposed Solution:**
${clause.recommendation}

I believe this revision would create a more balanced agreement that protects both parties' interests while maintaining the spirit of our partnership. I would appreciate the opportunity to discuss this further and find a mutually beneficial solution.

Could we schedule a brief call this week to address this? I'm flexible with timing and happy to work around your schedule.

Thank you for your consideration, and I look forward to your response.

Best regards,
[Your Name]`;
}

function generateFallbackTalkingPoints(clause: ContractClause): string[] {
  return [
    `The current ${clause.title} language creates ${clause.concerns[0]?.toLowerCase() || 'potential issues'}`,
    `Industry standard practice typically includes more balanced terms in this area`,
    `This revision protects both parties and reduces future disputes`,
    `The proposed change maintains the intent while improving fairness`,
    `Similar agreements we've reviewed include these protections`,
    `This modification reduces legal risk for both organizations`,
    `We're committed to a mutually beneficial partnership and believe this change supports that goal`,
  ];
}

function generateFallbackStrategies(clause: ContractClause): string[] {
  const strategies = [
    'Start with data: Present comparable contract terms from similar agreements',
    'Frame as mutual benefit: Explain how the change protects both parties',
    'Offer compromise: Suggest middle-ground language if full revision is rejected',
  ];

  if (clause.riskLevel === 'critical' || clause.riskLevel === 'high') {
    strategies.push('Set clear boundaries: Make it clear this is a deal-breaker if not addressed');
  } else {
    strategies.push('Show flexibility: Indicate willingness to find alternative solutions');
  }

  strategies.push('Document everything: Keep written record of all negotiation discussions');

  return strategies;
}

/**
 * Generate a comprehensive negotiation playbook for entire contract
 */
export async function generateNegotiationPlaybook(
  clauses: ContractClause[],
  contractContext: string,
  contractName: string
): Promise<string> {
  const priorityClauses = clauses
    .filter((c) => c.riskLevel === 'critical' || c.riskLevel === 'high')
    .sort((a, b) => {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.riskLevel] - order[b.riskLevel];
    });

  let playbook = `# Negotiation Playbook - ${contractName}\n\n`;
  playbook += `*Generated: ${new Date().toLocaleString()}*\n\n`;
  playbook += `---\n\n`;
  playbook += `## Executive Summary\n\n`;
  playbook += `This playbook outlines negotiation strategies for ${priorityClauses.length} high-priority clauses that require attention.\n\n`;
  playbook += `**Priority Breakdown:**\n`;
  playbook += `- Critical Issues: ${clauses.filter((c) => c.riskLevel === 'critical').length}\n`;
  playbook += `- High Priority: ${clauses.filter((c) => c.riskLevel === 'high').length}\n\n`;
  playbook += `**Recommended Approach:** Start with critical issues, then address high-priority items. Be prepared to compromise on lower-priority concerns.\n\n`;
  playbook += `---\n\n`;

  const scripts = await generateBatchNegotiationScripts(priorityClauses, contractContext);

  priorityClauses.forEach((clause, index) => {
    const script = scripts.get(clause.title);
    
    playbook += `## ${index + 1}. ${clause.title}\n\n`;
    playbook += `**Priority:** ${script?.priorityLevel || 'Should Change'} | **Risk Level:** ${clause.riskLevel.toUpperCase()}\n\n`;
    
    if (script) {
      playbook += `### 📧 Email Template\n\n`;
      playbook += `\`\`\`\n${script.emailTemplate}\n\`\`\`\n\n`;
      
      playbook += `### 💬 Talking Points\n\n`;
      script.talkingPoints.forEach((point, i) => {
        playbook += `${i + 1}. ${point}\n`;
      });
      playbook += `\n`;
      
      playbook += `### 🎯 Negotiation Strategies\n\n`;
      script.negotiationStrategies.forEach((strategy, i) => {
        playbook += `${i + 1}. ${strategy}\n`;
      });
      playbook += `\n`;
      
      playbook += `### ✏️ Suggested Alternative Language\n\n`;
      playbook += `\`\`\`\n${script.alternativeLanguage}\n\`\`\`\n\n`;
    } else {
      playbook += `*Script generation pending or failed - see individual clause details for recommendations.*\n\n`;
    }
    
    playbook += `---\n\n`;
  });

  playbook += `## General Negotiation Tips\n\n`;
  playbook += `1. **Stay Professional:** Maintain collaborative tone throughout\n`;
  playbook += `2. **Document Everything:** Keep written records of all discussions\n`;
  playbook += `3. **Know Your Limits:** Identify deal-breakers before negotiating\n`;
  playbook += `4. **Seek Win-Win:** Look for solutions that benefit both parties\n`;
  playbook += `5. **Use Leverage Wisely:** Reference industry standards and comparable agreements\n`;
  playbook += `6. **Be Patient:** Good negotiations take time\n`;
  playbook += `7. **Get Legal Review:** Consult attorney before finalizing major changes\n\n`;

  return playbook;
}
