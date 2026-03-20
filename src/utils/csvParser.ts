// src/utils/csvParser.ts

export interface CSVRow {
  type: string;
  content: string;
}

export const parseCSV = (content: string): CSVRow[] => {
  const lines = content.trim().split('\n');
  const items: CSVRow[] = [];

  // Skip header row if it looks like a header
  const startIndex = lines[0]?.toLowerCase().includes('type') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing: type,content
    // Support quoted values with commas
    const match = line.match(/^([^,]+),(.+)$/);
    if (match) {
      const type = match[1].trim();
      let content = match[2].trim();

      // Remove quotes if present
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.slice(1, -1);
      }

      items.push({ type, content });
    }
  }

  return items;
};

export const generateCSVTemplate = (): string => {
  return `type,content
url,https://example1.com
url,https://example2.com
text,Hello World
text,测试文本`;
};
