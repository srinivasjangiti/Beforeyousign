/**
 * REST API Infrastructure
 * 
 * Public API for integrations with:
 * - Rate limiting
 * - API key authentication
 * - Webhooks
 * - Usage tracking
 */

import { NextRequest, NextResponse } from 'next/server';

export interface APIKey {
  id: string;
  key: string;
  userId: string;
  name: string;
  permissions: string[];
  rateLimit: {
    requests: number;
    period: 'minute' | 'hour' | 'day';
  };
  createdAt: Date;
  lastUsed?: Date;
  active: boolean;
}

export interface WebhookEndpoint {
  id: string;
  userId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  retryPolicy: {
    maxRetries: number;
    backoff: 'linear' | 'exponential';
  };
}

export interface APIUsage {
  apiKeyId: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  responseTime: number;
  statusCode: number;
  error?: string;
}

class APIManager {
  private apiKeys: Map<string, APIKey> = new Map();
  private webhooks: Map<string, WebhookEndpoint> = new Map();
  private usage: APIUsage[] = [];
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Validate API key and check permissions
   */
  async validateAPIKey(
    key: string,
    requiredPermission?: string
  ): Promise<{ valid: boolean; apiKey?: APIKey; error?: string }> {
    const apiKey = this.apiKeys.get(key);

    if (!apiKey) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (!apiKey.active) {
      return { valid: false, error: 'API key is inactive' };
    }

    if (requiredPermission && !apiKey.permissions.includes(requiredPermission)) {
      return { valid: false, error: 'Insufficient permissions' };
    }

    // Check rate limit
    const rateLimitKey = `${apiKey.id}`;
    const limit = this.rateLimits.get(rateLimitKey);
    const now = Date.now();

    if (limit && now < limit.resetTime) {
      if (limit.count >= apiKey.rateLimit.requests) {
        return {
          valid: false,
          error: `Rate limit exceeded. Resets at ${new Date(limit.resetTime).toISOString()}`,
        };
      }
      limit.count++;
    } else {
      const periodMs = {
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
      }[apiKey.rateLimit.period];

      this.rateLimits.set(rateLimitKey, {
        count: 1,
        resetTime: now + periodMs,
      });
    }

    // Update last used
    apiKey.lastUsed = new Date();

    return { valid: true, apiKey };
  }

  /**
   * Create new API key
   */
  createAPIKey(
    userId: string,
    name: string,
    permissions: string[],
    rateLimit: APIKey['rateLimit']
  ): APIKey {
    const key = `sk_${this.generateSecureToken(32)}`;
    const apiKey: APIKey = {
      id: crypto.randomUUID(),
      key,
      userId,
      name,
      permissions,
      rateLimit,
      createdAt: new Date(),
      active: true,
    };

    this.apiKeys.set(key, apiKey);
    return apiKey;
  }

  /**
   * Register webhook endpoint
   */
  registerWebhook(
    userId: string,
    url: string,
    events: string[]
  ): WebhookEndpoint {
    const webhook: WebhookEndpoint = {
      id: crypto.randomUUID(),
      userId,
      url,
      events,
      secret: this.generateSecureToken(32),
      active: true,
      retryPolicy: {
        maxRetries: 3,
        backoff: 'exponential',
      },
    };

    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  /**
   * Trigger webhook
   */
  async triggerWebhook(event: string, data: any): Promise<void> {
    const webhooksToTrigger = Array.from(this.webhooks.values()).filter(
      (w) => w.active && w.events.includes(event)
    );

    const promises = webhooksToTrigger.map((webhook) =>
      this.deliverWebhook(webhook, event, data)
    );

    await Promise.allSettled(promises);
  }

  /**
   * Deliver webhook with retry logic
   */
  private async deliverWebhook(
    webhook: WebhookEndpoint,
    event: string,
    data: any,
    attempt: number = 1
  ): Promise<void> {
    try {
      const payload = {
        event,
        data,
        timestamp: new Date().toISOString(),
      };

      const signature = await this.generateWebhookSignature(
        JSON.stringify(payload),
        webhook.secret
      );

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok && attempt < webhook.retryPolicy.maxRetries) {
        const delay = this.calculateBackoff(attempt, webhook.retryPolicy.backoff);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.deliverWebhook(webhook, event, data, attempt + 1);
      }
    } catch (error) {
      console.error('[Webhook Delivery Error]', error);
      
      if (attempt < webhook.retryPolicy.maxRetries) {
        const delay = this.calculateBackoff(attempt, webhook.retryPolicy.backoff);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.deliverWebhook(webhook, event, data, attempt + 1);
      }
    }
  }

  /**
   * Calculate backoff delay
   */
  private calculateBackoff(attempt: number, strategy: 'linear' | 'exponential'): number {
    if (strategy === 'linear') {
      return 1000 * attempt; // 1s, 2s, 3s...
    } else {
      return 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s, 8s...
    }
  }

  /**
   * Generate webhook signature
   */
  private async generateWebhookSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const key = encoder.encode(secret);

    // Simple HMAC-like signature (in production, use proper crypto)
    const combined = new Uint8Array([...key, ...data]);
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate secure random token
   */
  private generateSecureToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    
    return result;
  }

  /**
   * Record API usage
   */
  recordUsage(usage: APIUsage): void {
    this.usage.push(usage);
  }

  /**
   * Get usage statistics
   */
  getUsageStats(apiKeyId: string, period: { start: Date; end: Date }): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    endpointBreakdown: Record<string, number>;
  } {
    const filtered = this.usage.filter(
      (u) =>
        u.apiKeyId === apiKeyId &&
        u.timestamp >= period.start &&
        u.timestamp <= period.end
    );

    const successful = filtered.filter((u) => u.statusCode >= 200 && u.statusCode < 300);
    const failed = filtered.filter((u) => u.statusCode >= 400);

    const endpointBreakdown = filtered.reduce((acc, u) => {
      acc[u.endpoint] = (acc[u.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests: filtered.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageResponseTime:
        filtered.reduce((sum, u) => sum + u.responseTime, 0) / filtered.length || 0,
      endpointBreakdown,
    };
  }
}

export const apiManager = new APIManager();

/**
 * API Middleware for authentication
 */
export async function withAPIAuth(
  req: NextRequest,
  handler: (req: NextRequest, apiKey: APIKey) => Promise<NextResponse>,
  requiredPermission?: string
): Promise<NextResponse> {
  const apiKey = req.headers.get('x-api-key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key required' },
      { status: 401 }
    );
  }

  const validation = await apiManager.validateAPIKey(apiKey, requiredPermission);

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || 'Invalid API key' },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const response = await handler(req, validation.apiKey!);
  const responseTime = Date.now() - startTime;

  // Record usage
  apiManager.recordUsage({
    apiKeyId: validation.apiKey!.id,
    endpoint: req.nextUrl.pathname,
    method: req.method,
    timestamp: new Date(),
    responseTime,
    statusCode: response.status,
  });

  return response;
}
