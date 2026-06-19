/**
 * Contract Versioning and Change Tracking System
 * 
 * Features:
 * - Version control for contracts
 * - Visual diff comparison
 * - Change tracking and audit trail
 * - Rollback capabilities
 * - Collaboration history
 * - Merge conflict detection
 */

// @ts-ignore - diff-match-patch doesn't have proper TypeScript types
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';

export interface ContractVersion {
  id: string;
  contractId: string;
  versionNumber: number;
  content: string;
  hash: string; // SHA-256 hash for integrity
  createdAt: Date;
  createdBy: string;
  changes: VersionChange[];
  tags: string[];
  comment: string;
  parentVersionId?: string;
  isMajor: boolean; // Major vs minor version
  metadata: {
    wordCount: number;
    clauseCount: number;
    riskScore?: number;
    comparisonWithPrevious?: VersionComparison;
  };
}

export interface VersionChange {
  type: 'addition' | 'deletion' | 'modification';
  section: string;
  oldText?: string;
  newText?: string;
  position: number;
  timestamp: Date;
  author: string;
  reason?: string;
  significance: 'minor' | 'moderate' | 'major' | 'critical';
}

export interface VersionComparison {
  addedLines: number;
  deletedLines: number;
  modifiedSections: number;
  netChange: number; // Percentage change
  majorChanges: string[];
  minorChanges: string[];
  riskImpact: 'increased' | 'decreased' | 'neutral';
  visualDiff: DiffSegment[];
}

export interface DiffSegment {
  type: 'unchanged' | 'added' | 'removed' | 'modified';
  text: string;
  lineNumber?: number;
  section?: string;
}

export interface MergeConflict {
  section: string;
  baseVersion: string;
  version1: string;
  version2: string;
  conflictType: 'content' | 'deletion' | 'both-modified';
  resolution?: 'version1' | 'version2' | 'manual' | 'merged';
  resolvedText?: string;
}

export class ContractVersionManager {
  private dmp: diff_match_patch;

  constructor() {
    this.dmp = new diff_match_patch();
  }

  /**
   * Create a new version from contract content
   */
  async createVersion(
    contractId: string,
    content: string,
    userId: string,
    comment: string,
    isMajor: boolean = false,
    parentVersionId?: string
  ): Promise<ContractVersion> {
    const hash = await this.generateHash(content);
    const versionNumber = await this.getNextVersionNumber(contractId, isMajor);
    
    const changes = parentVersionId 
      ? await this.detectChanges(parentVersionId, content)
      : [];

    const version: ContractVersion = {
      id: this.generateVersionId(),
      contractId,
      versionNumber,
      content,
      hash,
      createdAt: new Date(),
      createdBy: userId,
      changes,
      tags: [],
      comment,
      parentVersionId,
      isMajor,
      metadata: {
        wordCount: this.countWords(content),
        clauseCount: this.countClauses(content),
      },
    };

    return version;
  }

  /**
   * Compare two versions and generate diff
   */
  compareVersions(version1: ContractVersion, version2: ContractVersion): VersionComparison {
    const diffs = this.dmp.diff_main(version1.content, version2.content);
    this.dmp.diff_cleanupSemantic(diffs);

    let addedLines = 0;
    let deletedLines = 0;
    const majorChanges: string[] = [];
    const minorChanges: string[] = [];
    const visualDiff: DiffSegment[] = [];

    let currentLine = 1;
    for (const [op, text] of diffs) {
      const lineCount = (text.match(/\n/g) || []).length + 1;

      if (op === DIFF_INSERT) {
        addedLines += lineCount;
        visualDiff.push({
          type: 'added',
          text,
          lineNumber: currentLine,
        });
        
        // Detect major vs minor changes
        if (this.isMajorChange(text)) {
          majorChanges.push(this.extractChangeDescription(text));
        } else {
          minorChanges.push(this.extractChangeDescription(text));
        }
      } else if (op === DIFF_DELETE) {
        deletedLines += lineCount;
        visualDiff.push({
          type: 'removed',
          text,
          lineNumber: currentLine,
        });
        
        if (this.isMajorChange(text)) {
          majorChanges.push(`Removed: ${this.extractChangeDescription(text)}`);
        } else {
          minorChanges.push(`Removed: ${this.extractChangeDescription(text)}`);
        }
      } else {
        visualDiff.push({
          type: 'unchanged',
          text,
          lineNumber: currentLine,
        });
        currentLine += lineCount;
      }
    }

    const totalLines = this.countLines(version2.content);
    const netChange = ((addedLines + deletedLines) / totalLines) * 100;

    // Determine risk impact based on changes
    const riskImpact = this.assessRiskImpact(majorChanges, minorChanges);

    return {
      addedLines,
      deletedLines,
      modifiedSections: majorChanges.length + minorChanges.length,
      netChange,
      majorChanges,
      minorChanges,
      riskImpact,
      visualDiff,
    };
  }

  /**
   * Generate side-by-side diff visualization
   */
  generateSideBySideDiff(
    oldContent: string,
    newContent: string
  ): Array<{ oldLine: string; newLine: string; status: 'unchanged' | 'modified' | 'added' | 'removed' }> {
    const diffs = this.dmp.diff_main(oldContent, newContent);
    this.dmp.diff_cleanupSemantic(diffs);

    const result: Array<{
      oldLine: string;
      newLine: string;
      status: 'unchanged' | 'modified' | 'added' | 'removed';
    }> = [];

    let oldLines: string[] = [];
    let newLines: string[] = [];

    for (const [op, text] of diffs) {
      const lines = text.split('\n');

      if (op === DIFF_EQUAL) {
        lines.forEach((line: string) => {
          result.push({ oldLine: line, newLine: line, status: 'unchanged' });
        });
      } else if (op === DIFF_DELETE) {
        oldLines = lines;
      } else if (op === DIFF_INSERT) {
        newLines = lines;
        
        // Pair up old and new lines
        const maxLen = Math.max(oldLines.length, newLines.length);
        for (let i = 0; i < maxLen; i++) {
          result.push({
            oldLine: oldLines[i] || '',
            newLine: newLines[i] || '',
            status: oldLines[i] && newLines[i] ? 'modified' : 
                    oldLines[i] ? 'removed' : 'added',
          });
        }
        oldLines = [];
        newLines = [];
      }
    }

    return result;
  }

  /**
   * Detect merge conflicts between versions
   */
  detectMergeConflicts(
    baseVersion: ContractVersion,
    version1: ContractVersion,
    version2: ContractVersion
  ): MergeConflict[] {
    const conflicts: MergeConflict[] = [];

    // Split content into sections
    const baseSections = this.splitIntoSections(baseVersion.content);
    const sections1 = this.splitIntoSections(version1.content);
    const sections2 = this.splitIntoSections(version2.content);

    const allSectionNames = new Set([
      ...Object.keys(baseSections),
      ...Object.keys(sections1),
      ...Object.keys(sections2),
    ]);

    for (const sectionName of allSectionNames) {
      const baseText = baseSections[sectionName] || '';
      const text1 = sections1[sectionName] || '';
      const text2 = sections2[sectionName] || '';

      // Check if both versions modified the same section differently
      if (text1 !== baseText && text2 !== baseText && text1 !== text2) {
        conflicts.push({
          section: sectionName,
          baseVersion: baseText,
          version1: text1,
          version2: text2,
          conflictType: 'both-modified',
        });
      }
      // Check if one deleted while other modified
      else if ((text1 === '' && text2 !== baseText) || (text2 === '' && text1 !== baseText)) {
        conflicts.push({
          section: sectionName,
          baseVersion: baseText,
          version1: text1,
          version2: text2,
          conflictType: 'deletion',
        });
      }
    }

    return conflicts;
  }

  /**
   * Merge two versions with conflict resolution
   */
  mergeVersions(
    baseVersion: ContractVersion,
    version1: ContractVersion,
    version2: ContractVersion,
    conflictResolutions: Map<string, { resolution: 'version1' | 'version2' | 'manual'; text?: string }>
  ): { mergedContent: string; conflicts: MergeConflict[] } {
    const conflicts = this.detectMergeConflicts(baseVersion, version1, version2);
    
    const baseSections = this.splitIntoSections(baseVersion.content);
    const sections1 = this.splitIntoSections(version1.content);
    const sections2 = this.splitIntoSections(version2.content);

    const mergedSections: Record<string, string> = {};
    const allSectionNames = new Set([
      ...Object.keys(baseSections),
      ...Object.keys(sections1),
      ...Object.keys(sections2),
    ]);

    for (const sectionName of allSectionNames) {
      const baseText = baseSections[sectionName] || '';
      const text1 = sections1[sectionName] || '';
      const text2 = sections2[sectionName] || '';

      // Check if there's a conflict for this section
      const conflict = conflicts.find(c => c.section === sectionName);
      
      if (conflict) {
        const resolution = conflictResolutions.get(sectionName);
        if (resolution) {
          if (resolution.resolution === 'manual' && resolution.text) {
            mergedSections[sectionName] = resolution.text;
          } else if (resolution.resolution === 'version1') {
            mergedSections[sectionName] = text1;
          } else {
            mergedSections[sectionName] = text2;
          }
        } else {
          // No resolution provided, keep conflict marker
          mergedSections[sectionName] = this.createConflictMarker(baseText, text1, text2);
        }
      } else {
        // No conflict, use the modified version or base
        if (text1 !== baseText) {
          mergedSections[sectionName] = text1;
        } else if (text2 !== baseText) {
          mergedSections[sectionName] = text2;
        } else {
          mergedSections[sectionName] = baseText;
        }
      }
    }

    const mergedContent = Object.entries(mergedSections)
      .map(([name, content]) => content)
      .join('\n\n');

    return { mergedContent, conflicts };
  }

  /**
   * Generate version tree/graph
   */
  generateVersionTree(versions: ContractVersion[]): VersionTreeNode[] {
    const tree: Map<string, VersionTreeNode> = new Map();

    // Create nodes
    for (const version of versions) {
      tree.set(version.id, {
        version,
        children: [],
        parent: version.parentVersionId || null,
      });
    }

    // Build parent-child relationships
    const roots: VersionTreeNode[] = [];
    for (const node of tree.values()) {
      if (node.parent) {
        const parentNode = tree.get(node.parent);
        if (parentNode) {
          parentNode.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  /**
   * Rollback to a specific version
   */
  async rollbackToVersion(
    contractId: string,
    targetVersionId: string,
    userId: string,
    reason: string
  ): Promise<ContractVersion> {
    // Fetch the target version
    const targetVersion = await this.getVersion(targetVersionId);
    
    // Create a new version with the old content
    return this.createVersion(
      contractId,
      targetVersion.content,
      userId,
      `Rollback to version ${targetVersion.versionNumber}: ${reason}`,
      true, // Major version since it's a rollback
      targetVersionId
    );
  }

  // Private helper methods

  private async generateHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateVersionId(): string {
    return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getNextVersionNumber(contractId: string, isMajor: boolean): Promise<number> {
    // This would query the database for the latest version
    // For now, return a placeholder
    return isMajor ? 2.0 : 1.1;
  }

  private async detectChanges(parentVersionId: string, newContent: string): Promise<VersionChange[]> {
    // This would fetch the parent version and compare
    // For now, return empty array
    return [];
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private countClauses(text: string): number {
    // Count sections that look like clauses
    const clauses = text.match(/^#+\s+.+$/gm) || [];
    return clauses.length;
  }

  private countLines(text: string): number {
    return text.split('\n').length;
  }

  private isMajorChange(text: string): boolean {
    // Check if change involves key terms
    const majorKeywords = [
      'liability', 'indemnification', 'termination', 'payment',
      'intellectual property', 'confidentiality', 'warranty',
      'dispute resolution', 'governing law', 'damages',
    ];

    const lowerText = text.toLowerCase();
    return majorKeywords.some(keyword => lowerText.includes(keyword));
  }

  private extractChangeDescription(text: string): string {
    // Extract first sentence or first 100 characters
    const firstSentence = text.match(/^[^.!?]+[.!?]/);
    if (firstSentence) {
      return firstSentence[0].trim();
    }
    return text.substring(0, 100).trim() + (text.length > 100 ? '...' : '');
  }

  private assessRiskImpact(majorChanges: string[], minorChanges: string[]): 'increased' | 'decreased' | 'neutral' {
    // Analyze if changes increase or decrease risk
    const riskIncreasingKeywords = ['unlimited', 'sole discretion', 'no liability', 'without notice'];
    const riskDecreasingKeywords = ['limited to', 'reasonable', 'mutual', 'both parties'];

    let riskScore = 0;
    const allChanges = [...majorChanges, ...minorChanges].join(' ').toLowerCase();

    for (const keyword of riskIncreasingKeywords) {
      if (allChanges.includes(keyword)) riskScore += 2;
    }

    for (const keyword of riskDecreasingKeywords) {
      if (allChanges.includes(keyword)) riskScore -= 1;
    }

    if (riskScore > 2) return 'increased';
    if (riskScore < -2) return 'decreased';
    return 'neutral';
  }

  private splitIntoSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    let currentSection = 'Preamble';
    let currentContent: string[] = [];

    for (const line of lines) {
      // Check if line is a section header
      const headerMatch = line.match(/^#+\s+(.+)$/);
      if (headerMatch) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        // Start new section
        currentSection = headerMatch[1];
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  private createConflictMarker(baseText: string, text1: string, text2: string): string {
    return `
<<<<<<< VERSION 1
${text1}
=======
${text2}
>>>>>>> VERSION 2

BASE VERSION:
${baseText}
`;
  }

  private async getVersion(versionId: string): Promise<ContractVersion> {
    // This would query the database
    // For now, throw error
    throw new Error('Not implemented');
  }
}

export interface VersionTreeNode {
  version: ContractVersion;
  children: VersionTreeNode[];
  parent: string | null;
}

// Utility functions for UI components

export function formatVersionNumber(version: number): string {
  return `v${version.toFixed(1)}`;
}

export function getVersionColor(isMajor: boolean): string {
  return isMajor ? 'text-blue-600' : 'text-gray-600';
}

export function formatChangeType(type: string): string {
  const map: Record<string, string> = {
    'addition': 'Added',
    'deletion': 'Removed',
    'modification': 'Modified',
  };
  return map[type] || type;
}
