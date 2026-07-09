import test from 'node:test';
import assert from 'node:assert';
import { executeMerge } from '../operations/merge';
import { MergeOptions, UploadedFile } from '../types';
import { PDFDocument } from 'pdf-lib';

test('Merge Operation - Basic functionality', async (t) => {
  // Create mock PDFs
  const doc1 = await PDFDocument.create();
  const page1 = doc1.addPage([100, 100]);
  page1.drawText('Doc 1', { x: 10, y: 10 });
  const bytes1 = await doc1.save();

  const doc2 = await PDFDocument.create();
  const page2 = doc2.addPage([200, 200]);
  page2.drawText('Doc 2', { x: 20, y: 20 });
  const bytes2 = await doc2.save();

  const files: UploadedFile[] = [
    { name: 'b.pdf', mimeType: 'application/pdf', buffer: bytes1, size: bytes1.length },
    { name: 'a.pdf', mimeType: 'application/pdf', buffer: bytes2, size: bytes2.length },
  ];

  await t.test('merges in provided order', async () => {
    const result = await executeMerge({
      requestId: 'test-1',
      files,
      options: { sortType: 'orderProvided' }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.pages, 2);
    
    // Check resulting PDF
    const mergedDoc = await PDFDocument.load(result.buffer!);
    assert.strictEqual(mergedDoc.getPageCount(), 2);
    
    // First page should be [100, 100]
    const p1 = mergedDoc.getPage(0);
    assert.strictEqual(p1.getSize().width, 100);
    assert.strictEqual(p1.getSize().height, 100);
  });

  await t.test('sorts by filename', async () => {
    const result = await executeMerge({
      requestId: 'test-2',
      files,
      options: { sortType: 'byFileName' }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.pages, 2);
    
    // Check resulting PDF
    const mergedDoc = await PDFDocument.load(result.buffer!);
    
    // First page should be 'a.pdf' which is [200, 200]
    const p1 = mergedDoc.getPage(0);
    assert.strictEqual(p1.getSize().width, 200);
    assert.strictEqual(p1.getSize().height, 200);
  });
});
