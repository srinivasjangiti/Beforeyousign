const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

async function generateTestAssets() {
  const dir = path.join(__dirname, 'test-assets');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Generate sample1.pdf (1 page)
  const pdf1 = await PDFDocument.create();
  const page1 = pdf1.addPage([500, 500]);
  page1.drawText('Sample Document 1', { x: 50, y: 400, size: 30, color: rgb(0, 0.53, 0.71) });
  fs.writeFileSync(path.join(dir, 'sample1.pdf'), await pdf1.save());
  console.log('Created sample1.pdf');

  // Generate sample2.pdf (2 pages)
  const pdf2 = await PDFDocument.create();
  const page2a = pdf2.addPage([500, 500]);
  page2a.drawText('Sample Document 2 - Page 1', { x: 50, y: 400, size: 20 });
  const page2b = pdf2.addPage([500, 500]);
  page2b.drawText('Sample Document 2 - Page 2', { x: 50, y: 400, size: 20 });
  fs.writeFileSync(path.join(dir, 'sample2.pdf'), await pdf2.save());
  console.log('Created sample2.pdf');

  // Generate a mock JPG (1x1 red pixel)
  // Base64 of a 1x1 red pixel JPEG
  const jpgBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
  fs.writeFileSync(path.join(dir, 'sample1.jpg'), Buffer.from(jpgBase64, 'base64'));
  fs.writeFileSync(path.join(dir, 'sample2.jpg'), Buffer.from(jpgBase64, 'base64'));
  console.log('Created sample1.jpg and sample2.jpg');
}

generateTestAssets().catch(console.error);
