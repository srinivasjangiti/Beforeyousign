// Bookmark and notes management for contract clauses

export interface ClauseBookmark {
  clauseId: string;
  clauseTitle: string;
  note: string;
  timestamp: number;
  tags: string[];
}

export interface BookmarkCollection {
  contractId: string;
  contractName: string;
  bookmarks: ClauseBookmark[];
  createdAt: number;
  updatedAt: number;
}

// In-memory storage (replace with database in production)
const bookmarkStore = new Map<string, BookmarkCollection>();

/**
 * Generate a unique contract ID from analysis metadata
 */
export function generateContractId(fileName: string, timestamp: number): string {
  return `${fileName}-${timestamp}`.replace(/[^a-zA-Z0-9-]/g, '_');
}

/**
 * Add or update a bookmark for a clause
 */
export function addBookmark(
  contractId: string,
  contractName: string,
  clauseId: string,
  clauseTitle: string,
  note: string = '',
  tags: string[] = []
): ClauseBookmark {
  let collection = bookmarkStore.get(contractId);
  
  if (!collection) {
    collection = {
      contractId,
      contractName,
      bookmarks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // Check if bookmark already exists
  const existingIndex = collection.bookmarks.findIndex(
    (b) => b.clauseId === clauseId
  );

  const bookmark: ClauseBookmark = {
    clauseId,
    clauseTitle,
    note,
    timestamp: Date.now(),
    tags,
  };

  if (existingIndex >= 0) {
    collection.bookmarks[existingIndex] = bookmark;
  } else {
    collection.bookmarks.push(bookmark);
  }

  collection.updatedAt = Date.now();
  bookmarkStore.set(contractId, collection);

  return bookmark;
}

/**
 * Remove a bookmark
 */
export function removeBookmark(contractId: string, clauseId: string): boolean {
  const collection = bookmarkStore.get(contractId);
  if (!collection) return false;

  const initialLength = collection.bookmarks.length;
  collection.bookmarks = collection.bookmarks.filter(
    (b) => b.clauseId !== clauseId
  );

  if (collection.bookmarks.length < initialLength) {
    collection.updatedAt = Date.now();
    bookmarkStore.set(contractId, collection);
    return true;
  }

  return false;
}

/**
 * Get all bookmarks for a contract
 */
export function getBookmarks(contractId: string): ClauseBookmark[] {
  const collection = bookmarkStore.get(contractId);
  return collection?.bookmarks || [];
}

/**
 * Check if a clause is bookmarked
 */
export function isBookmarked(contractId: string, clauseId: string): boolean {
  const collection = bookmarkStore.get(contractId);
  return collection?.bookmarks.some((b) => b.clauseId === clauseId) || false;
}

/**
 * Get a specific bookmark
 */
export function getBookmark(
  contractId: string,
  clauseId: string
): ClauseBookmark | null {
  const collection = bookmarkStore.get(contractId);
  return collection?.bookmarks.find((b) => b.clauseId === clauseId) || null;
}

/**
 * Export bookmarks as JSON
 */
export function exportBookmarksJSON(contractId: string): string {
  const collection = bookmarkStore.get(contractId);
  if (!collection) {
    return JSON.stringify({ error: 'No bookmarks found' }, null, 2);
  }
  return JSON.stringify(collection, null, 2);
}

/**
 * Export bookmarks as Markdown
 */
export function exportBookmarksMarkdown(contractId: string): string {
  const collection = bookmarkStore.get(contractId);
  if (!collection) {
    return '# No bookmarks found';
  }

  let markdown = `# Bookmarked Clauses - ${collection.contractName}\n\n`;
  markdown += `*Last updated: ${new Date(collection.updatedAt).toLocaleString()}*\n\n`;
  markdown += `---\n\n`;

  collection.bookmarks.forEach((bookmark, index) => {
    markdown += `## ${index + 1}. ${bookmark.clauseTitle}\n\n`;
    
    if (bookmark.tags.length > 0) {
      markdown += `**Tags:** ${bookmark.tags.map((t) => `\`${t}\``).join(', ')}\n\n`;
    }
    
    if (bookmark.note) {
      markdown += `**Notes:**\n\n${bookmark.note}\n\n`;
    } else {
      markdown += `*No notes added*\n\n`;
    }
    
    markdown += `*Bookmarked: ${new Date(bookmark.timestamp).toLocaleString()}*\n\n`;
    markdown += `---\n\n`;
  });

  return markdown;
}

/**
 * Get all contract collections (for listing)
 */
export function getAllCollections(): BookmarkCollection[] {
  return Array.from(bookmarkStore.values());
}

/**
 * Delete entire collection
 */
export function deleteCollection(contractId: string): boolean {
  return bookmarkStore.delete(contractId);
}
