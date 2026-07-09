export function parsePageRanges(ranges: string, totalPages: number): number[] {
  const indices: number[] = [];
  const parts = ranges.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);
      
      if (isNaN(start) || isNaN(end)) continue;
      
      for (let i = start; i <= end && i <= totalPages; i++) {
        if (i > 0 && !indices.includes(i - 1)) {
          indices.push(i - 1); // Convert to 0-based index
        }
      }
    } else {
      const page = parseInt(trimmed, 10);
      if (!isNaN(page) && page > 0 && page <= totalPages && !indices.includes(page - 1)) {
        indices.push(page - 1);
      }
    }
  }

  return indices.sort((a, b) => a - b);
}
