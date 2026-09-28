import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { caseStudyFrontmatterSchema, type CaseStudyFrontmatter } from '@/content/schemas';

const CASE_STUDIES_DIR = path.join(process.cwd(), 'content', 'case-studies');

export interface CaseStudy {
  frontmatter: CaseStudyFrontmatter;
  content: string;
}

function readCaseStudyFile(filename: string): CaseStudy {
  const raw = fs.readFileSync(path.join(CASE_STUDIES_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  return {
    frontmatter: caseStudyFrontmatterSchema.parse(data),
    content,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  const files = fs.readdirSync(CASE_STUDIES_DIR).filter((f) => f.endsWith('.mdx'));
  return files
    .map(readCaseStudyFile)
    .filter((cs) => cs.frontmatter.published)
    .sort((a, b) => a.frontmatter.slug.localeCompare(b.frontmatter.slug));
}

export function getCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readCaseStudyFile(`${slug}.mdx`);
}
