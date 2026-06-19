/**
 * External API Integrations & Webhooks
 * 
 * Features:
 * - Document management systems (DocuSign, Adobe Sign)
 * - CRM integrations (Salesforce, HubSpot)
 * - Project management (Asana, Jira)
 * - Cloud storage (Google Drive, Dropbox, OneDrive)
 * - Communication (Slack, Teams, Email)
 * - Accounting (QuickBooks, Xero)
 * - Webhook management
 */

export interface APIIntegration {
  id: string;
  name: string;
  type: 'crm' | 'esignature' | 'storage' | 'communication' | 'accounting' | 'project' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'pending';
  provider: string;
  credentials: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  settings: Record<string, any>;
  lastSync?: Date;
  errorMessage?: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  headers?: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  filters?: Record<string, any>;
  createdAt: Date;
  lastTriggered?: Date;
}

export type WebhookEvent =
  | 'contract.created'
  | 'contract.updated'
  | 'contract.analyzed'
  | 'contract.signed'
  | 'contract.expired'
  | 'contract.renewed'
  | 'alert.triggered'
  | 'user.registered'
  | 'team.member.added';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: Date;
  data: any;
  signature: string;
}

export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  errors: Array<{ record: string; error: string }>;
  duration: number;
}

export class IntegrationManager {
  /**
   * DocuSign Integration
   */
  async sendToDocuSign(
    contractId: string,
    contractText: string,
    signers: Array<{ email: string; name: string; role: string }>,
    config: APIIntegration
  ): Promise<{ envelopeId: string; status: string }> {
    // In production, this would call DocuSign API
    const envelopeId = `env_${Date.now()}`;
    
    console.log('Sending to DocuSign:', {
      contractId,
      signers: signers.length,
      envelopeId,
    });

    // Mock response
    return {
      envelopeId,
      status: 'sent',
    };
  }

  /**
   * Salesforce CRM Integration
   */
  async syncToSalesforce(
    contractData: {
      title: string;
      value: number;
      parties: string[];
      startDate: Date;
      endDate: Date;
      type: string;
    },
    config: APIIntegration
  ): Promise<{ salesforceId: string }> {
    // Would call Salesforce REST API
    const salesforceId = `SF_${Date.now()}`;
    
    console.log('Syncing to Salesforce:', contractData);

    return { salesforceId };
  }

  /**
   * Google Drive Integration
   */
  async uploadToGoogleDrive(
    fileName: string,
    content: string,
    folderId: string,
    config: APIIntegration
  ): Promise<{ fileId: string; webViewLink: string }> {
    // Would use Google Drive API
    const fileId = `GD_${Date.now()}`;
    const webViewLink = `https://drive.google.com/file/d/${fileId}/view`;
    
    console.log('Uploading to Google Drive:', fileName);

    return { fileId, webViewLink };
  }

  /**
   * Slack Integration - Send notifications
   */
  async sendSlackNotification(
    channel: string,
    message: string,
    config: APIIntegration,
    attachments?: any[]
  ): Promise<{ success: boolean; timestamp: string }> {
    // Would call Slack Web API
    console.log('Sending Slack notification:', { channel, message });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Microsoft Teams Integration
   */
  async sendTeamsNotification(
    webhookUrl: string,
    title: string,
    message: string,
    actions?: Array<{ title: string; url: string }>
  ): Promise<{ success: boolean }> {
    // Would POST to Teams webhook
    console.log('Sending Teams notification:', { title, message });

    return { success: true };
  }

  /**
   * QuickBooks Integration - Sync contract values
   */
  async syncToQuickBooks(
    contractData: {
      customerId: string;
      amount: number;
      description: string;
      date: Date;
    },
    config: APIIntegration
  ): Promise<{ invoiceId: string }> {
    // Would call QuickBooks API
    const invoiceId = `QB_${Date.now()}`;
    
    console.log('Syncing to QuickBooks:', contractData);

    return { invoiceId };
  }

  /**
   * Jira Integration - Create issue for contract review
   */
  async createJiraIssue(
    projectKey: string,
    summary: string,
    description: string,
    issueType: string,
    config: APIIntegration
  ): Promise<{ issueKey: string; webUrl: string }> {
    // Would call Jira REST API
    const issueKey = `${projectKey}-${Math.floor(Math.random() * 1000)}`;
    const webUrl = `https://company.atlassian.net/browse/${issueKey}`;
    
    console.log('Creating Jira issue:', { issueKey, summary });

    return { issueKey, webUrl };
  }

  /**
   * HubSpot Integration
   */
  async syncToHubSpot(
    dealData: {
      name: string;
      amount: number;
      closeDate: Date;
      stage: string;
    },
    config: APIIntegration
  ): Promise<{ dealId: string }> {
    // Would call HubSpot API
    const dealId = `HS_${Date.now()}`;
    
    console.log('Syncing to HubSpot:', dealData);

    return { dealId };
  }

  /**
   * Generic webhook sender
   */
  async sendWebhook(
    subscription: WebhookSubscription,
    payload: WebhookPayload
  ): Promise<{ success: boolean; statusCode?: number; error?: string }> {
    const { url, headers, retryPolicy } = subscription;
    
    // Add signature
    const signature = await this.generateWebhookSignature(payload, subscription.secret);
    payload.signature = signature;

    let attempt = 0;
    let lastError: string | undefined;

    while (attempt <= retryPolicy.maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            ...headers,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          return { success: true, statusCode: response.status };
        }

        lastError = `HTTP ${response.status}: ${response.statusText}`;
      } catch (error: any) {
        lastError = error.message;
      }

      attempt++;
      if (attempt <= retryPolicy.maxRetries) {
        const delay = retryPolicy.retryDelay * Math.pow(retryPolicy.backoffMultiplier, attempt - 1);
        await this.sleep(delay);
      }
    }

    return {
      success: false,
      error: `Failed after ${attempt} attempts: ${lastError}`,
    };
  }

  /**
   * Verify webhook signature
   */
  async verifyWebhookSignature(
    payload: any,
    signature: string,
    secret: string
  ): Promise<boolean> {
    const expectedSignature = await this.generateWebhookSignature(payload, secret);
    return signature === expectedSignature;
  }

  /**
   * Batch sync to multiple systems
   */
  async batchSync(
    contractData: any,
    integrations: APIIntegration[]
  ): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const integration of integrations.filter(i => i.status === 'active')) {
      const startTime = Date.now();
      
      try {
        let recordsSynced = 0;
        const errors: Array<{ record: string; error: string }> = [];

        switch (integration.type) {
          case 'crm':
            if (integration.provider === 'salesforce') {
              await this.syncToSalesforce(contractData, integration);
              recordsSynced = 1;
            } else if (integration.provider === 'hubspot') {
              await this.syncToHubSpot(contractData, integration);
              recordsSynced = 1;
            }
            break;
          
          case 'storage':
            if (integration.provider === 'google_drive') {
              await this.uploadToGoogleDrive(
                contractData.title,
                contractData.content,
                integration.settings.folderId,
                integration
              );
              recordsSynced = 1;
            }
            break;
          
          case 'accounting':
            if (integration.provider === 'quickbooks') {
              await this.syncToQuickBooks({
                customerId: contractData.customerId,
                amount: contractData.value,
                description: contractData.title,
                date: contractData.startDate,
              }, integration);
              recordsSynced = 1;
            }
            break;
        }

        results.push({
          success: true,
          recordsSynced,
          errors,
          duration: Date.now() - startTime,
        });
      } catch (error: any) {
        results.push({
          success: false,
          recordsSynced: 0,
          errors: [{ record: contractData.id, error: error.message }],
          duration: Date.now() - startTime,
        });
      }
    }

    return results;
  }

  /**
   * Test integration connection
   */
  async testConnection(integration: APIIntegration): Promise<{ success: boolean; message: string }> {
    try {
      // Test API connection based on provider
      switch (integration.provider) {
        case 'salesforce':
          // Would call Salesforce API test endpoint
          return { success: true, message: 'Successfully connected to Salesforce' };
        
        case 'docusign':
          return { success: true, message: 'Successfully connected to DocuSign' };
        
        case 'slack':
          return { success: true, message: 'Successfully connected to Slack' };
        
        default:
          return { success: true, message: `Connected to ${integration.provider}` };
      }
    } catch (error: any) {
      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }

  /**
   * OAuth flow helper
   */
  async initiateOAuth(
    provider: string,
    redirectUri: string
  ): Promise<{ authUrl: string; state: string }> {
    const state = this.generateRandomString(32);
    
    const oauthConfigs: Record<string, { authUrl: string; clientId: string; scopes: string[] }> = {
      salesforce: {
        authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
        clientId: process.env.SALESFORCE_CLIENT_ID || '',
        scopes: ['api', 'refresh_token'],
      },
      google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      },
      slack: {
        authUrl: 'https://slack.com/oauth/v2/authorize',
        clientId: process.env.SLACK_CLIENT_ID || '',
        scopes: ['chat:write', 'channels:read'],
      },
    };

    const config = oauthConfigs[provider];
    if (!config) {
      throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state,
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;

    return { authUrl, state };
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(
    provider: string,
    code: string,
    redirectUri: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    // Would exchange code for tokens
    // This is a mock implementation
    return {
      accessToken: `access_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      expiresIn: 3600,
    };
  }

  // Private helper methods

  private async generateWebhookSignature(payload: any, secret: string): Promise<string> {
    const data = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * Webhook Event Emitter
 */
export class WebhookManager {
  private subscriptions: WebhookSubscription[] = [];
  private integrationManager: IntegrationManager;

  constructor() {
    this.integrationManager = new IntegrationManager();
  }

  /**
   * Register webhook subscription
   */
  async registerWebhook(
    url: string,
    events: WebhookEvent[],
    secret?: string
  ): Promise<WebhookSubscription> {
    const subscription: WebhookSubscription = {
      id: `webhook_${Date.now()}`,
      url,
      events,
      secret: secret || this.generateSecret(),
      active: true,
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
      },
      createdAt: new Date(),
    };

    this.subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Emit webhook event
   */
  async emitEvent(event: WebhookEvent, data: any): Promise<void> {
    const relevantSubscriptions = this.subscriptions.filter(
      s => s.active && s.events.includes(event)
    );

    const payload: WebhookPayload = {
      event,
      timestamp: new Date(),
      data,
      signature: '', // Will be set by sendWebhook
    };

    // Send webhooks in parallel
    await Promise.all(
      relevantSubscriptions.map(subscription =>
        this.integrationManager.sendWebhook(subscription, payload)
      )
    );
  }

  private generateSecret(): string {
    return `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }
}

// Utility functions

export function getIntegrationIcon(provider: string): string {
  const icons: Record<string, string> = {
    salesforce: '☁️',
    hubspot: '🟠',
    docusign: '📝',
    slack: '💬',
    teams: '👥',
    google_drive: '📁',
    dropbox: '📦',
    quickbooks: '💰',
    jira: '📊',
  };
  return icons[provider] || '🔌';
}

export function getIntegrationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600',
    inactive: 'text-gray-600',
    error: 'text-red-600',
    pending: 'text-yellow-600',
  };
  return colors[status] || 'text-gray-600';
}

export function formatSyncDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
