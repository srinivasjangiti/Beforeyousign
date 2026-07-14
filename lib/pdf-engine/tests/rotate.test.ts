import test from 'node:test';
import assert from 'node:assert';
import { executeRotate } from '../operations/rotate';
import { UploadedFile } from '../types';
import { PDFDocument } from 'pdf-lib';

test('Rotate Operation - Basic functionality', async (t) => {
  // Create mock PDF with 3 pages
  const doc = await PDFDocument.create();
  doc.setTitle('Test Rotate Document');
  
  for (let i = 0; i < 3; i++) {
    const page = doc.addPage([100, 100]);
    page.drawText(`Page ${i + 1}`, { x: 10, y: 10 });
    // Default rotation is 0
  }
  
  const bytes = await doc.save();
  const files: UploadedFile[] = [
    { name: 'rotate.pdf', mimeType: 'application/pdf', buffer: bytes, size: bytes.length }
  ];

  await t.test('rotates all pages', async () => {
    const result = await executeRotate({
      requestId: 'rotate-1',
      files,
      options: { angle: 90, pages: 'all' }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.pages, 3);
    
    // Check resulting PDF
    const rotatedDoc = await PDFDocument.load(result.buffer!);
    assert.strictEqual(rotatedDoc.getPageCount(), 3);
    assert.strictEqual(rotatedDoc.getTitle(), 'Test Rotate Document'); // Metadata preserved
    
    for (let i = 0; i < 3; i++) {
      assert.strictEqual(rotatedDoc.getPage(i).getRotation().angle, 90);
    }
  });

  await t.test('rotates specific pages', async () => {
    const result = await executeRotate({
      requestId: 'rotate-2',
      files,
      options: { angle: 180, pages: '2' }
    });

    assert.strictEqual(result.success, true);
    
    const rotatedDoc = await PDFDocument.load(result.buffer!);
    assert.strictEqual(rotatedDoc.getPage(0).getRotation().angle, 0);
    assert.strictEqual(rotatedDoc.getPage(1).getRotation().angle, 180); // Page 2
    assert.strictEqual(rotatedDoc.getPage(2).getRotation().angle, 0);
  });
});
