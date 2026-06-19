/**
 * Export Manager - Unified Export Interface
 * 
 * Consolidates functionality from:
 * - export-utils.ts (basic exports)
 * - advanced-export-integrations.ts (advanced exports & integrations)
 * 
 * Provides single, consistent API for all export operations
 */

import { exportAsPDF as basicPDF, exportAsDOCX as basicDOCX, exportAsMarkdown as basicMarkdown } from './export-utils';
import { AdvancedExportEngine } from './advanced-export-integrations';
import type { ExportOptions } from './template-types';

export class ExportManager {
  private advancedExporter = new AdvancedExportEngine();

  /**
   * Unified export function
   * Automatically selects basic or advanced exporter based on options
   */
  async export(content: string, options: Partial<ExportOptions> = {}): Promise<void> {
    const format = options.format || 'pdf';
    
    // Use advanced exporter if any advanced options are specified
    const useAdvanced = Boolean(
      options.styling ||
      options.branding ||
      options.output?.destination !== 'download' ||
      format === 'latex' ||
      format === 'epub'
    );

    if (useAdvanced) {
      await this.advancedExporter.export(content, {
        format,
        ...options,
      } as ExportOptions);
    } else {
      // Use simple exporters for basic cases
      await this.basicExport(content, format);
    }
  }

  /**
   * Basic export using legacy utilities
   * Fast and simple, no external dependencies
   */
  private async basicExport(content: string, format: string): Promise<void> {
    const templateName = 'Contract';
    
    switch (format) {
      case 'pdf':
        await basicPDF(templateName, content);
        return;
      case 'docx':
        await basicDOCX(templateName, content);
        return;
      case 'markdown':
        basicMarkdown(templateName, content);
        return;
      case 'html':
        this.downloadAsHTML(content, templateName);
        return;
      case 'plain-text':
        this.downloadAsText(content, templateName);
        return;
      default:
        throw new Error(`Unsupported basic export format: ${format}. Use advanced exporter.`);
    }
  }

  /**
   * Download HTML content
   */
  private downloadAsHTML(content: string, filename: string): void {
    const html = this.convertToHTML(content);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Download plain text
   */
  private downloadAsText(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Convert markdown content to HTML
   */
  private convertToHTML(content: string): string {
    // Simple markdown to HTML conversion
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  /**
   * Export to PDF with advanced options
   */
  async exportToPDF(content: string, options: Partial<ExportOptions> = {}): Promise<void> {
    return this.export(content, { ...options, format: 'pdf' });
  }

  /**
   * Export to DOCX with advanced options
   */
  async exportToDOCX(content: string, options: Partial<ExportOptions> = {}): Promise<void> {
    return this.export(content, { ...options, format: 'docx' });
  }

  /**
   * Export to HTML
   */
  async exportToHTML(content: string, options: Partial<ExportOptions> = {}): Promise<void> {
    return this.export(content, { ...options, format: 'html' });
  }

  /**
   * Export to Markdown
   */
  async exportToMarkdown(content: string, options: Partial<ExportOptions> = {}): Promise<void> {
    return this.export(content, { ...options, format: 'markdown' });
  }

  /**
   * Send document for e-signature
   */
  async sendForSignature(content: string, signers: any[], provider: 'docusign' | 'adobe-sign' | 'hellosign' | 'pandadoc' = 'docusign'): Promise<any> {
    return this.advancedExporter.sendForSignature({
      provider,
      document: {
        name: 'Contract for Signature',
        content,
        format: 'pdf',
      },
      signers,
    });
  }

  /**
   * Upload to cloud storage
   */
  async uploadToCloud(content: string, provider: 'google-drive' | 'dropbox' | 'onedrive' | 's3' | 'box', filename: string): Promise<any> {
    // Use advanced exporter to generate content and upload
    return this.advancedExporter.uploadToCloud({
      provider,
      action: 'upload',
      file: {
        name: filename,
        content, // Advanced exporter will handle conversion
        mimeType: 'application/pdf',
      },
    });
  }

  /**
   * Integrate with CRM
   */
  async integrateCRM(content: string, provider: 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho', dealData: any): Promise<any> {
    // Use advanced exporter to handle CRM integration
    return this.advancedExporter.integrateCRM({
      provider,
      action: 'attach-document',
      document: {
        name: `Contract_${Date.now()}.pdf`,
        content, // Advanced exporter will handle conversion
      },
      deal: dealData,
    });
  }

  /**
   * Bulk export multiple templates
   */
  async bulkExport(templates: Array<{ templateId: string; variables: Record<string, any>; outputName: string }>, format: string, destination: any): Promise<any> {
    return this.advancedExporter.bulkExport({
      name: `Bulk Export ${new Date().toISOString()}`,
      templates,
      format,
      options: { format } as ExportOptions,
      destination,
    });
  }
}

// Singleton instance
export const exportManager = new ExportManager();

// Re-export legacy functions for backward compatibility
export const exportAsPDF = (content: string) => exportManager.exportToPDF(content);
export const exportAsDOCX = (content: string) => exportManager.exportToDOCX(content);
export const exportAsHTML = (content: string) => exportManager.exportToHTML(content);
export const exportAsMarkdown = (content: string) => exportManager.exportToMarkdown(content);
