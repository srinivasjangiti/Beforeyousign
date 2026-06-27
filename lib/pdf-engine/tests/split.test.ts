import test from 'node:test';
import assert from 'node:assert';
import { executeSplit } from '../operations/split';
import { UploadedFile } from '../types';
import { PDFDocument } from 'pdf-lib';

test('Split Operation - Basic functionality', async (t) => {
  // Create mock PDF with 5 pages
  const doc = await PDFDocument.create();
  doc.setTitle('Test Split Document');
  
  for (let i = 0; i < 5; i++) {
    const page = doc.addPage([100, 100]);
    page.drawText(`Page ${i + 1}`, { x: 10, y: 10 });
  }
  
  const bytes = await doc.save();
  const files: UploadedFile[] = [
    { name: 'test.pdf', mimeType: 'application/pdf', buffer: bytes, size: bytes.length }
  ];

  await t.test('splits a single page', async () => {
    const result = await executeSplit({
      requestId: 'split-1',
      files,
      options: { pages: '3' }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.pages, 1);
    
    // Check resulting PDF
    const splitDoc = await PDFDocument.load(result.buffer!);
    assert.strictEqual(splitDoc.getPageCount(), 1);
    assert.strictEqual(splitDoc.getTitle(), 'Test Split Document'); // Metadata preserved
  });

  await t.test('splits a range of pages', async () => {
    const result = await executeSplit({
      requestId: 'split-2',
      files,
      options: { pages: '2-4' }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.pages, 3);
    
    const splitDoc = await PDFDocument.load(result.buffer!);
    assert.strictEqual(splitDoc.getPageCount(), 3);
  });

  await t.test('handles multiple ranges and singles', async () => {
    const result = await executeSplit({
      requestId: 'split-3',
      files,
      options: { pages: '1, 3-5' }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.pages, 4);
    
    const splitDoc = await PDFDocument.load(result.buffer!);
    assert.strictEqual(splitDoc.getPageCount(), 4);
  });

  await t.test('throws on out of bounds', async () => {
    await assert.rejects(
      async () => {
        await executeSplit({
          requestId: 'split-4',
          files,
          options: { pages: '10' }
        });
      },
      { name: 'PDFValidationError' }
    );
  });
});
