/**
 * Automated Obligation Tracker - REVOLUTIONARY
 * Extract and track all contractual obligations with deadlines
 */

export interface Obligation {
  id: string;
  party: string;
  description: string;
  deadline?: Date;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'critical' | 'high' | 'medium' | 'low';
  source: string; // Clause reference
  dependencies: string[];
}

export class ObligationTracker {
  async extractObligations(contractText: string, parties: string[]): Promise<Obligation[]> {
    const obligations: Obligation[] = [];
    const sentences = contractText.split(/[.!?]+/).filter(s => s.trim());
    
    sentences.forEach((sentence, idx) => {
      const lower = sentence.toLowerCase();
      
      // Look for obligation keywords
      if (lower.includes('shall') || lower.includes('must') || lower.includes('will')) {
        parties.forEach(party => {
          if (lower.includes(party.toLowerCase())) {
            const obligation = this.parseObligation(sentence, party, idx);
            if (obligation) obligations.push(obligation);
          }
        });
      }
    });
    
    return obligations;
  }

  private parseObligation(sentence: string, party: string, index: number): Obligation | null {
    const lower = sentence.toLowerCase();
    
    // Determine priority
    const priority = this.determinePriority(sentence);
    
    // Extract deadline
    const deadline = this.extractDeadline(sentence);
    
    // Determine status
    const status = deadline && deadline < new Date() ? 'overdue' : 'pending';
    
    return {
      id: `OBL-${index}-${party.substring(0, 3).toUpperCase()}`,
      party,
      description: sentence.trim(),
      deadline,
      status,
      priority,
      source: `Clause ${Math.floor(index / 5) + 1}`,
      dependencies: [],
    };
  }

  private determinePriority(sentence: string): 'critical' | 'high' | 'medium' | 'low' {
    const lower = sentence.toLowerCase();
    
    if (lower.includes('immediately') || lower.includes('promptly')) return 'critical';
    if (lower.includes('payment') || lower.includes('deliver')) return 'high';
    if (lower.includes('notice') || lower.includes('report')) return 'medium';
    return 'low';
  }

  private extractDeadline(sentence: string): Date | undefined {
    const dayMatch = sentence.match(/(\d+)\s*day/i);
    if (dayMatch) {
      const days = parseInt(dayMatch[1]);
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + days);
      return deadline;
    }
    
    const monthMatch = sentence.match(/(\d+)\s*month/i);
    if (monthMatch) {
      const months = parseInt(monthMatch[1]);
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + months);
      return deadline;
    }
    
    return undefined;
  }

  getUpcoming(obligations: Obligation[], days: number = 30): Obligation[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return obligations.filter(obl => 
      obl.status === 'pending' &&
      obl.deadline &&
      obl.deadline >= now &&
      obl.deadline <= futureDate
    ).sort((a, b) => 
      (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0)
    );
  }

  getOverdue(obligations: Obligation[]): Obligation[] {
    return obligations.filter(obl => obl.status === 'overdue');
  }

  getByParty(obligations: Obligation[], party: string): Obligation[] {
    return obligations.filter(obl => obl.party === party);
  }

  getCritical(obligations: Obligation[]): Obligation[] {
    return obligations.filter(obl => 
      obl.priority === 'critical' || obl.priority === 'high'
    );
  }

  markComplete(obligations: Obligation[], obligationId: string): Obligation[] {
    return obligations.map(obl => 
      obl.id === obligationId 
        ? { ...obl, status: 'completed' as const }
        : obl
    );
  }

  getCompletionRate(obligations: Obligation[]): {
    total: number;
    completed: number;
    percentage: number;
  } {
    const total = obligations.length;
    const completed = obligations.filter(o => o.status === 'completed').length;
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}

export const obligationTracker = new ObligationTracker();
