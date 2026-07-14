/**
 * Database abstraction layer with localStorage fallback for MVP
 * Production: Replace with PostgreSQL, MongoDB, or Supabase
 * 
 * Design Philosophy:
 * - Type-safe operations
 * - Automatic migrations
 * - Transaction support
 * - Index optimization
 * - Query caching
 */

export interface DatabaseConfig {
  provider: 'localStorage' | 'indexedDB' | 'postgresql';
  encryptionKey?: string;
  connectionString?: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  cache?: boolean;
  cacheDuration?: number; // milliseconds
}

class Database {
  private config: DatabaseConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: DatabaseConfig = { provider: 'localStorage' }) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Initialize database schema
    const schema = this.getItem<number>('__schema_version');
    if (!schema || schema < 2) {
      this.migrate();
    }
  }

  private migrate(): void {
    console.log('[Database] Running migrations...');
    
    // Migration v1 → v2: Add indexes
    const signatureRequests = this.getAllItems('signatureRequests');
    if (signatureRequests) {
      // Add status index for faster filtering
      this.setItem('__index_signatures_status', this.buildIndex(signatureRequests, 'status'));
    }

    this.setItem('__schema_version', 2);
    console.log('[Database] Migrations complete');
  }

  private buildIndex(items: any[], key: string): Record<string, string[]> {
    const index: Record<string, string[]> = {};
    
    items.forEach((item) => {
      const value = item[key];
      if (!index[value]) {
        index[value] = [];
      }
      index[value].push(item.id);
    });

    return index;
  }

  private getCacheKey(collection: string, query: QueryOptions = {}): string {
    return `${collection}:${JSON.stringify(query)}`;
  }

  private getFromCache(key: string, ttl: number = this.CACHE_DEFAULT_TTL): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setToCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private invalidateCache(collection: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(collection + ':')) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get single item by key
   */
  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[Database] Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * Set single item
   */
  setItem<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[Database] Error writing ${key}:`, error);
      
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanup();
        return this.setItem(key, value); // Retry after cleanup
      }
      
      return false;
    }
  }

  /**
   * Get all items from a collection
   */
  getAllItems<T>(collection: string, options: QueryOptions = {}): T[] {
    const cacheKey = this.getCacheKey(collection, options);
    
    if (options.cache) {
      const cached = this.getFromCache(cacheKey, options.cacheDuration);
      if (cached) return cached;
    }

    const items = this.getItem<T[]>(collection) || [];
    let result = [...items];

    // Apply ordering
    if (options.orderBy) {
      result.sort((a: any, b: any) => {
        const aVal = a[options.orderBy!];
        const bVal = b[options.orderBy!];
        
        if (aVal < bVal) return options.orderDirection === 'desc' ? 1 : -1;
        if (aVal > bVal) return options.orderDirection === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    if (options.offset !== undefined) {
      result = result.slice(options.offset);
    }
    if (options.limit !== undefined) {
      result = result.slice(0, options.limit);
    }

    if (options.cache) {
      this.setToCache(cacheKey, result);
    }

    return result;
  }

  /**
   * Insert item into collection
   */
  insert<T extends { id: string }>(collection: string, item: T): boolean {
    const items = this.getAllItems<T>(collection);
    
    // Check for duplicate ID
    if (items.some(i => i.id === item.id)) {
      console.warn(`[Database] Duplicate ID ${item.id} in ${collection}`);
      return false;
    }

    items.push(item);
    const success = this.setItem(collection, items);
    
    if (success) {
      this.invalidateCache(collection);
    }

    return success;
  }

  /**
   * Update item in collection
   */
  update<T extends { id: string }>(
    collection: string, 
    id: string, 
    updates: Partial<T>
  ): boolean {
    const items = this.getAllItems<T>(collection);
    const index = items.findIndex(i => i.id === id);
    
    if (index === -1) {
      console.warn(`[Database] Item ${id} not found in ${collection}`);
      return false;
    }

    items[index] = { ...items[index], ...updates };
    const success = this.setItem(collection, items);
    
    if (success) {
      this.invalidateCache(collection);
    }

    return success;
  }

  /**
   * Delete item from collection
   */
  delete<T extends { id: string }>(collection: string, id: string): boolean {
    const items = this.getAllItems<T>(collection);
    const filtered = items.filter(i => i.id !== id);
    
    if (filtered.length === items.length) {
      console.warn(`[Database] Item ${id} not found in ${collection}`);
      return false;
    }

    const success = this.setItem(collection, filtered);
    
    if (success) {
      this.invalidateCache(collection);
    }

    return success;
  }

  /**
   * Find items matching criteria
   */
  find<T>(
    collection: string,
    predicate: (item: T) => boolean,
    options: QueryOptions = {}
  ): T[] {
    const items = this.getAllItems<T>(collection, options);
    return items.filter(predicate);
  }

  /**
   * Count items in collection
   */
  count(collection: string): number {
    return this.getAllItems(collection).length;
  }

  /**
   * Clear all data (use with caution)
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    const confirmation = confirm(
      '⚠️ This will delete ALL data. Are you absolutely sure?'
    );
    
    if (!confirmation) return;

    localStorage.clear();
    this.cache.clear();
    console.log('[Database] All data cleared');
  }

  /**
   * Cleanup old data to free space
   */
  private cleanup(): void {
    console.log('[Database] Running cleanup...');
    
    // Clear cache
    this.cache.clear();
    
    // Remove old analytics data (older than 90 days)
    const analytics = this.getItem<any[]>('analytics') || [];
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const recentAnalytics = analytics.filter(a => 
      new Date(a.timestamp).getTime() > ninetyDaysAgo
    );
    
    if (recentAnalytics.length < analytics.length) {
      this.setItem('analytics', recentAnalytics);
      console.log(`[Database] Cleaned ${analytics.length - recentAnalytics.length} old analytics entries`);
    }
  }

  /**
   * Export all data for backup
   */
  exportData(): Record<string, any> {
    if (typeof window === 'undefined') return {};

    const data: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('__')) {
        data[key] = this.getItem(key);
      }
    }

    return data;
  }

  /**
   * Import data from backup
   */
  importData(data: Record<string, any>): boolean {
    if (typeof window === 'undefined') return false;

    try {
      Object.entries(data).forEach(([key, value]) => {
        this.setItem(key, value);
      });
      
      this.invalidateCache('*');
      console.log('[Database] Data imported successfully');
      return true;
    } catch (error) {
      console.error('[Database] Import failed:', error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    used: number;
    available: number;
    percentage: number;
    items: number;
  } {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, percentage: 0, items: 0 };
    }

    const data = JSON.stringify(localStorage);
    const used = new Blob([data]).size;
    const available = 5 * 1024 * 1024; // 5MB typical limit
    
    return {
      used,
      available,
      percentage: (used / available) * 100,
      items: localStorage.length,
    };
  }
}

// Singleton instance
export const db = new Database();

// Export for advanced usage
export default Database;
