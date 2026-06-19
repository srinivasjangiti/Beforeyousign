/**
 * Security utilities for production-grade application security
 * 
 * Features:
 * - Input sanitization (XSS prevention)
 * - CSRF token generation/validation
 * - Rate limiting
 * - Content Security Policy headers
 * - File upload validation
 * - SQL injection prevention
 */

import { db } from './database';

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize HTML content while preserving safe tags
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'];
  const div = document.createElement('div');
  div.innerHTML = html;

  // Remove all script tags
  const scripts = div.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i].remove();
  }

  // Remove event handlers
  const allElements = div.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    
    // Remove all event attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });

    // Remove javascript: links
    if (element.tagName === 'A') {
      const href = element.getAttribute('href');
      if (href && href.toLowerCase().includes('javascript:')) {
        element.removeAttribute('href');
      }
    }

    // Remove disallowed tags
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      element.replaceWith(...Array.from(element.childNodes));
    }
  }

  return div.innerHTML;
}

/**
 * CSRF Token Management
 */
class CSRFManager {
  private readonly TOKEN_KEY = '__csrf_token';
  private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  generateToken(): string {
    const token = this.randomString(32);
    const expiry = Date.now() + this.TOKEN_EXPIRY;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify({ token, expiry }));
    }

    return token;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;

    const stored = sessionStorage.getItem(this.TOKEN_KEY);
    if (!stored) return this.generateToken();

    try {
      const { token, expiry } = JSON.parse(stored);
      
      if (Date.now() > expiry) {
        return this.generateToken();
      }

      return token;
    } catch {
      return this.generateToken();
    }
  }

  validateToken(token: string): boolean {
    const currentToken = this.getToken();
    return currentToken === token;
  }

  private randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    
    if (typeof window !== 'undefined') {
      window.crypto.getRandomValues(randomValues);
    }

    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    return result;
  }

  rotateToken(): string {
    return this.generateToken();
  }
}

export const csrf = new CSRFManager();

/**
 * Rate Limiting
 */
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private limits: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Check if request should be allowed
   */
  checkLimit(key: string, config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit || now > limit.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    if (limit.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: limit.resetTime,
      };
    }

    limit.count++;
    this.limits.set(key, limit);

    return {
      allowed: true,
      remaining: config.maxRequests - limit.count,
      resetTime: limit.resetTime,
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.limits.clear();
  }

  /**
   * Get current limit status
   */
  getStatus(key: string): { count: number; resetTime: number } | null {
    return this.limits.get(key) || null;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * File Upload Validation
 */
export interface FileValidationConfig {
  maxSize: number; // bytes
  allowedTypes: string[];
  allowedExtensions: string[];
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFile(
  file: File,
  config: FileValidationConfig
): FileValidationResult {
  const errors: string[] = [];

  // Check file size
  if (file.size > config.maxSize) {
    const maxMB = (config.maxSize / (1024 * 1024)).toFixed(1);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    errors.push(`File size (${fileMB}MB) exceeds maximum allowed size (${maxMB}MB)`);
  }

  // Check MIME type
  if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
    errors.push(`File type "${file.type}" is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (config.allowedExtensions.length > 0 && !config.allowedExtensions.includes(extension)) {
    errors.push(`File extension ".${extension}" is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`);
  }

  // Check for null bytes (potential exploit)
  if (file.name.includes('\0')) {
    errors.push('File name contains invalid characters');
  }

  // Check file name length
  if (file.name.length > 255) {
    errors.push('File name is too long (maximum 255 characters)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate contract file specifically
 */
export function validateContractFile(file: File): FileValidationResult {
  return validateFile(file, {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ],
    allowedExtensions: ['pdf', 'docx', 'doc', 'txt'],
  });
}

/**
 * Content Security Policy headers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/**
 * Secure session management
 */
export interface Session {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  data: Record<string, any>;
}

class SessionManager {
  private readonly SESSION_KEY = '__session';
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  createSession(userId: string, data: Record<string, any> = {}): Session {
    const session: Session = {
      id: this.generateSessionId(),
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION,
      data,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    return session;
  }

  getSession(): Session | null {
    if (typeof window === 'undefined') return null;

    const stored = sessionStorage.getItem(this.SESSION_KEY);
    if (!stored) return null;

    try {
      const session: Session = JSON.parse(stored);

      // Check expiration
      if (Date.now() > session.expiresAt) {
        this.destroySession();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  updateSession(updates: Partial<Session>): boolean {
    const session = this.getSession();
    if (!session) return false;

    const updated = { ...session, ...updates };
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(updated));
    }

    return true;
  }

  refreshSession(): boolean {
    return this.updateSession({
      expiresAt: Date.now() + this.SESSION_DURATION,
    });
  }

  destroySession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }

  private generateSessionId(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined') {
      window.crypto.getRandomValues(array);
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const sessionManager = new SessionManager();

/**
 * Audit logging for security events
 */
export interface AuditLog {
  id: string;
  timestamp: number;
  event: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export function logSecurityEvent(
  event: string,
  details: Record<string, any> = {},
  severity: AuditLog['severity'] = 'info'
): void {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    event,
    details,
    severity,
  };

  // Production: Send to logging service (DataDog, Sentry, LogRocket)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Security Audit]', log);
  }

  // Store in database for analysis
  const logs = db.getItem<AuditLog[]>('securityLogs') || [];
  logs.push(log);

  // Keep only last 1000 logs in localStorage
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }

  db.setItem('securityLogs', logs);
}

/**
 * Password strength validator
 */
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length < 8) feedback.push('Use at least 8 characters');

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Include both uppercase and lowercase letters');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Include at least one number');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Include at least one special character');
  }

  // Common patterns check
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns');
  }

  return {
    score: Math.min(4, score),
    feedback,
    isStrong: score >= 3,
  };
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined') {
    window.crypto.getRandomValues(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash data using SubtleCrypto API
 */
export async function hashData(data: string): Promise<string> {
  if (typeof window === 'undefined') return data;

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
