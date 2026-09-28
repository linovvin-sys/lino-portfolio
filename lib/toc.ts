export interface TocEntry {
  id: string;
  text: string;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function extractToc(markdown: string): TocEntry[] {
  const headingLines = markdown.match(/^##\s+.+$/gm) ?? [];
  return headingLines.map((line) => {
    const text = line.replace(/^##\s+/, '').trim();
    return { id: slugifyHeading(text), text };
  });
}
