/**
 * BeforeYouSign Icon Generator
 * Run with: node scripts/generate-icons.js
 * Requires: canvas (npm install canvas --save-dev)
 * Or just use any image editor to make 16/48/128px PNGs.
 * 
 * This script generates simple SVG-based icons programmatically.
 * The icon is a scale/balance emoji (⚖) on dark background.
 */

const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const outDir = path.join(__dirname, '..', 'icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

sizes.forEach(size => {
  const fontSize = Math.round(size * 0.55);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#1c1917"/>
  <text x="50%" y="54%" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, sans-serif">⚖️</text>
</svg>`;
  
  const svgPath = path.join(outDir, `icon${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ Generated ${svgPath}`);
});

console.log('\nSVG icons generated in browser-extension/icons/');
console.log('For Chrome, convert to PNG using an online SVG→PNG converter or Inkscape:');
sizes.forEach(s => console.log(`  icon${s}.svg → icon${s}.png`));
console.log('\nOr install canvas: npm install canvas --save-dev');
console.log('Then re-run this script for automatic PNG generation.');
