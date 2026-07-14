// Shareable analysis link utilities
import { ContractAnalysis } from './types';

export interface ShareableLink {
  id: string;
  analysis: ContractAnalysis;
  password?: string;
  expiresAt: Date;
  createdAt: Date;
  viewCount: number;
}

// In-memory store (replace with database in production)
const shareLinks = new Map<string, ShareableLink>();

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function createShareableLink(
  analysis: ContractAnalysis,
  expiresInDays: number = 7,
  password?: string
): string {
  const id = generateShareId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  shareLinks.set(id, {
    id,
    analysis,
    password,
    expiresAt,
    createdAt: new Date(),
    viewCount: 0,
  });

  return id;
}

export function getSharedAnalysis(
  id: string,
  password?: string
): ContractAnalysis | null {
  const link = shareLinks.get(id);

  if (!link) return null;
  if (link.expiresAt < new Date()) {
    shareLinks.delete(id);
    return null;
  }
  if (link.password && link.password !== password) {
    return null;
  }

  link.viewCount++;
  return link.analysis;
}

export function deleteShareLink(id: string): boolean {
  return shareLinks.delete(id);
}

export function cleanupExpiredLinks(): void {
  const now = new Date();
  for (const [id, link] of shareLinks.entries()) {
    if (link.expiresAt < now) {
      shareLinks.delete(id);
    }
  }
}

// Clean up expired links every hour
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredLinks, 60 * 60 * 1000);
}
