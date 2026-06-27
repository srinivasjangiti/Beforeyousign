const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp'); // For image to PDF
const { performance } = require('perf_hooks');

const ASSETS_DIR = path.join(__dirname, 'test-assets');
const COMPLEX_PDF_PATH = path.join(ASSETS_DIR, 'complex.pdf');
const FORM_PDF_PATH = path.join(ASSETS_DIR, 'form.pdf');

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function measure(name, fn) {
  console.log(`\n--- Starting Audit: ${name} ---`);
  const startMem = process.memoryUsage().heapUsed;
  const start = performance.now();
  
  let result;
  try {
    result = await fn();
  } catch (e) {
    console.error(`Error in ${name}:`, e.message);
    return;
  }
  
  const end = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  
  const timeMs = end - start;
  const memUsed = Math.max(0, endMem - startMem);
  
  console.log(`Time: ${timeMs.toFixed(2)} ms`);
  console.log(`Peak RAM (Delta): ${formatBytes(memUsed)}`);
  
  if (result && result.size) {
    console.log(`Output Size: ${formatBytes(result.size)}`);
  }
  if (result && result.originalSize) {
    const ratio = (1 - result.size / result.originalSize) * 100;
    console.log(`Compression Ratio: ${ratio.toFixed(2)}%`);
  }
  
  return result;
}

async function checkPDF(bytes, description) {
  const doc = await PDFDocument.load(bytes);
  console.log(`Fidelity Check [${description}]:`);
  console.log(` - Pages: ${doc.getPageCount()}`);
  
  // Try to check forms
  const form = doc.getForm();
  const fields = form.getFields();
  console.log(` - Form Fields: ${fields.length > 0 ? 'Preserved (' + fields.length + ')' : 'Lost / None'}`);
  
  // Check outlines/bookmarks if we could (pdf-lib doesn't expose a high level API for reading outlines easily, but we can check catalog)
  const catalog = doc.catalog;
  const outlines = catalog.lookupMaybe(doc.context.obj('Outlines'));
  console.log(` - Bookmarks (Outlines): ${outlines ? 'Preserved' : 'Lost / None'}`);
  
  return doc;
}

async function runAudit() {
  if (!fs.existsSync(COMPLEX_PDF_PATH) || !fs.existsSync(FORM_PDF_PATH)) {
    console.error("Test assets missing. Run curl commands first.");
    return;
  }

  const complexBytes = fs.readFileSync(COMPLEX_PDF_PATH);
  const formBytes = fs.readFileSync(FORM_PDF_PATH);

  console.log("=== ORIGINAL FILES ===");
  console.log(`Complex PDF: ${formatBytes(complexBytes.length)}`);
  await checkPDF(complexBytes, "Original Complex PDF");
  
  console.log(`\nForm PDF: ${formatBytes(formBytes.length)}`);
  await checkPDF(formBytes, "Original Form PDF");

  // 1. Audit Merge
  await measure('Merge PDF (complex + form)', async () => {
    const mergedPdf = await PDFDocument.create();
    
    const doc1 = await PDFDocument.load(complexBytes);
    const copied1 = await mergedPdf.copyPages(doc1, doc1.getPageIndices());
    copied1.forEach(p => mergedPdf.addPage(p));

    const doc2 = await PDFDocument.load(formBytes);
    const copied2 = await mergedPdf.copyPages(doc2, doc2.getPageIndices());
    copied2.forEach(p => mergedPdf.addPage(p));

    const bytes = await mergedPdf.save();
    await checkPDF(bytes, "Merged Output");
    return { size: bytes.length };
  });

  // 2. Audit Split
  await measure('Split PDF (complex pages 1-3)', async () => {
    const splitPdf = await PDFDocument.create();
    const doc1 = await PDFDocument.load(complexBytes);
    const copied = await splitPdf.copyPages(doc1, [0, 1, 2]);
    copied.forEach(p => splitPdf.addPage(p));
    
    const bytes = await splitPdf.save();
    await checkPDF(bytes, "Split Output");
    return { size: bytes.length };
  });

  // 3. Audit Compress
  await measure('Compress PDF (complex)', async () => {
    const doc = await PDFDocument.load(complexBytes);
    const compressedBytes = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });
    return { size: compressedBytes.length, originalSize: complexBytes.length };
  });

  // 4. Audit JPG -> PDF
  // We need a dummy JPG. We can generate one with sharp on the fly.
  const dummyJpg = await sharp({
    create: {
      width: 2000,
      height: 3000,
      channels: 3,
      background: { r: 255, g: 0, b: 0 }
    }
  }).jpeg().toBuffer();

  await measure('JPG -> PDF', async () => {
    const pdfDoc = await PDFDocument.create();
    const image = await pdfDoc.embedJpg(dummyJpg);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Scale image to fit page while maintaining aspect ratio
    const imgDims = image.scale(1);
    const scale = Math.min(
      (width - 40) / imgDims.width,
      (height - 40) / imgDims.height
    );

    const scaledWidth = imgDims.width * scale;
    const scaledHeight = imgDims.height * scale;

    page.drawImage(image, {
      x: (width - scaledWidth) / 2,
      y: (height - scaledHeight) / 2,
      width: scaledWidth,
      height: scaledHeight,
    });
    
    const bytes = await pdfDoc.save();
    return { size: bytes.length };
  });
}

runAudit().catch(console.error);
