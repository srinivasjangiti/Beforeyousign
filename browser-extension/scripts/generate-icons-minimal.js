/**
 * Minimal PNG icon generator — no external dependencies
 * Generates 1×1 colored pixel PNGs scaled to needed sizes.
 * For production, replace with proper icons.
 * Run: node scripts/generate-icons-minimal.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function writePNG(filename, size, r, g, b) {
  // Create raw RGBA image data (size × size, all same color)
  const channels = 4;
  const width = size, height = size;
  // Each row: filter byte (0) + RGBA pixels
  const rawData = Buffer.alloc(height * (1 + width * channels));
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * channels);
    rawData[rowOffset] = 0; // filter type None
    for (let x = 0; x < width; x++) {
      const pixOffset = rowOffset + 1 + x * channels;
      const cx = x - width / 2, cy = y - height / 2;
      const radius = width * 0.45;
      const inCircle = cx * cx + cy * cy <= radius * radius;
      
      // Draw a simple filled circle on dark background
      if (inCircle) {
        rawData[pixOffset]     = 255; // R — white circle
        rawData[pixOffset + 1] = 255; // G
        rawData[pixOffset + 2] = 255; // B
        rawData[pixOffset + 3] = 255; // A
      } else {
        rawData[pixOffset]     = r; // dark background
        rawData[pixOffset + 1] = g;
        rawData[pixOffset + 2] = b;
        rawData[pixOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  
  function crc32(buf) {
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
    let crc = 0xFFFFFFFF;
    for (const b of buf) crc = table[(crc ^ b) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const crcInput = Buffer.concat([typeBuf, data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(crcInput), 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB — wait, we need RGBA
  ihdr[9] = 6;  // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const png = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(filename, png);
  console.log(`✓ ${path.basename(filename)} (${size}×${size})`);
}

// Generate icons: dark stone background (#1c1917 = 28, 25, 23)
writePNG(path.join(outDir, 'icon16.png'),  16,  28, 25, 23);
writePNG(path.join(outDir, 'icon48.png'),  48,  28, 25, 23);
writePNG(path.join(outDir, 'icon128.png'), 128, 28, 25, 23);

console.log('\nDone! Icons saved to browser-extension/icons/');
console.log('For better icons, use an image editor to replace these with a proper ⚖ scale logo.');
