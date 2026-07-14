const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createAssets() {
  const assetsDir = path.join(__dirname, 'test-assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

  // Create complex.pdf
  const pdfDoc = await PDFDocument.create();
  const page1 = pdfDoc.addPage([595.28, 841.89]);
  page1.drawText('Complex PDF Page 1', { x: 50, y: 800, size: 24 });
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  page2.drawText('Complex PDF Page 2', { x: 50, y: 800, size: 24 });
  fs.writeFileSync(path.join(assetsDir, 'complex.pdf'), await pdfDoc.save());

  // Create form.pdf
  const pdfDoc2 = await PDFDocument.create();
  const formPage = pdfDoc2.addPage([595.28, 841.89]);
  formPage.drawText('Form PDF Page 1', { x: 50, y: 800, size: 24 });
  fs.writeFileSync(path.join(assetsDir, 'form.pdf'), await pdfDoc2.save());

  // Create sample1.jpg and sample2.jpg
  await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 }
    }
  })
    .jpeg()
    .toFile(path.join(assetsDir, 'sample1.jpg'));

  await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 4,
      background: { r: 0, g: 0, b: 255, alpha: 1 }
    }
  })
    .jpeg()
    .toFile(path.join(assetsDir, 'sample2.jpg'));

  console.log('Test assets created.');
}

createAssets().catch(console.error);
