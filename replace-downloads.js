const fs = require('fs');

const files = [
  'lib/export-utils.ts',
  'lib/export-manager.ts',
  'components/CompareVersions.tsx',
  'components/PDFTools.tsx',
  'components/TemplatesEnhanced.tsx',
  'components/AnalysisResult.tsx',
  'components/AIContractDrafter.tsx',
  'app/admin/page.tsx',
  'lib/download-utils.ts'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  if (file === 'lib/download-utils.ts') continue;
  
  let content = fs.readFileSync(file, 'utf8');
  
  const regex = /const\s+url\s*=\s*URL\.createObjectURL\(([^)]+)\);\s*const\s+a\s*=\s*document\.createElement\('a'\);\s*a\.href\s*=\s*url;\s*a\.download\s*=\s*([^;]+);\s*(?:document\.body\.appendChild\(a\);\s*)?a\.click\(\);\s*(?:document\.body\.removeChild\(a\);\s*)?(?:URL\.revokeObjectURL\([^)]+\);)?/g;
  
  let newContent = content.replace(regex, (match, blobVar, downloadExpr) => {
    return `safeDownload(${blobVar}, ${downloadExpr});`;
  });
  
  if (newContent !== content) {
    const importStmt = "import { safeDownload } from '@/lib/download-utils';\n";
    if (!newContent.includes('download-utils')) {
      if (newContent.includes("import { ")) {
        newContent = newContent.replace(/import \{ /, importStmt + 'import { ');
      } else {
        newContent = importStmt + newContent;
      }
    }
    fs.writeFileSync(file, newContent);
    console.log('Updated ' + file);
  }
}
