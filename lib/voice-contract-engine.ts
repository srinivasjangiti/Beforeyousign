/**
 * Voice-to-Contract Generator - REVOLUTIONARY
 * Create legal contracts by speaking - no typing required
 */

export interface VoiceSession {
  transcript: string[];
  contractType?: string;
  parties?: string[];
  terms: Record<string, any>;
}

export class VoiceContractEngine {
  private session: VoiceSession = { transcript: [], terms: {} };

  async processVoiceInput(transcript: string): Promise<{
    understood: boolean;
    response: string;
    contractReady: boolean;
  }> {
    this.session.transcript.push(transcript);
    
    // Parse intent
    const intent = this.parseIntent(transcript);
    
    // Update session
    this.updateSession(intent);
    
    // Generate response
    const response = this.generateResponse(intent);
    const contractReady = this.isContractReady();
    
    return {
      understood: true,
      response,
      contractReady,
    };
  }

  async generateContract(): Promise<string> {
    const type = this.session.contractType || 'services';
    const parties = this.session.parties || ['Party A', 'Party B'];
    const terms = this.session.terms;
    
    return this.buildContract(type, parties, terms);
  }

  private parseIntent(text: string): any {
    const lower = text.toLowerCase();
    
    if (lower.includes('employment') || lower.includes('hire')) {
      return { type: 'contract_type', value: 'employment' };
    }
    
    if (lower.includes('service') || lower.includes('consulting')) {
      return { type: 'contract_type', value: 'services' };
    }
    
    if (lower.includes('nda') || lower.includes('confidential')) {
      return { type: 'contract_type', value: 'nda' };
    }
    
    const amountMatch = text.match(/\$?([\d,]+)/);
    if (amountMatch) {
      return { type: 'payment', value: amountMatch[1] };
    }
    
    const durationMatch = text.match(/(\d+)\s*(month|year)/i);
    if (durationMatch) {
      return { type: 'duration', value: durationMatch[1], unit: durationMatch[2] };
    }
    
    return { type: 'general', value: text };
  }

  private updateSession(intent: any): void {
    if (intent.type === 'contract_type') {
      this.session.contractType = intent.value;
    } else if (intent.type === 'payment') {
      this.session.terms.payment = intent.value;
    } else if (intent.type === 'duration') {
      this.session.terms.duration = intent.value;
      this.session.terms.durationUnit = intent.unit;
    }
  }

  private generateResponse(intent: any): string {
    if (intent.type === 'contract_type') {
      return `Great! I'll create a ${intent.value} agreement. What are the payment terms?`;
    }
    
    if (intent.type === 'payment') {
      return `Payment of $${intent.value} noted. How long should this contract last?`;
    }
    
    if (intent.type === 'duration') {
      return `${intent.value} ${intent.unit} duration set. I have all the information I need. Ready to generate?`;
    }
    
    return "I understand. What else should I include?";
  }

  private isContractReady(): boolean {
    return !!(this.session.contractType && this.session.terms.payment && this.session.terms.duration);
  }

  private buildContract(type: string, parties: string[], terms: any): string {
    return `# ${type.toUpperCase()} AGREEMENT

This Agreement is entered into as of ${new Date().toLocaleDateString()} between:

${parties[0]} and ${parties[1]}

## Payment Terms
Total: $${terms.payment || '[AMOUNT]'}
Duration: ${terms.duration || '[DURATION]'} ${terms.durationUnit || 'months'}

## Terms and Conditions
[Contract provisions generated from voice input]

AGREED AND ACCEPTED:

_______________________
${parties[0]}

_______________________
${parties[1]}`;
  }

  resetSession(): void {
    this.session = { transcript: [], terms: {} };
  }
}

export const voiceContractEngine = new VoiceContractEngine();
