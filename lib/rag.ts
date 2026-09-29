import { profile } from '@/content/profile';
import { experience } from '@/content/experience';
import { capabilities } from '@/content/capabilities';
import { projects } from '@/content/projects';
import { roadmap } from '@/content/roadmap';
import { getAllCaseStudies } from '@/lib/case-studies';

export interface RagDocument {
  id: string;
  title: string;
  section: string;
  url: string;
  text: string;
}

let corpus: RagDocument[] | null = null;

function buildCorpus(): RagDocument[] {
  const docs: RagDocument[] = [];

  docs.push({
    id: 'profile',
    title: `${profile.name} — ${profile.title}`,
    section: 'About',
    url: '/about',
    text: [profile.tagline, profile.bio, ...profile.principles.map((p) => `${p.title}: ${p.description}`)].join(' '),
  });

  for (const role of experience) {
    docs.push({
      id: `experience-${role.id}`,
      title: `${role.role} at ${role.company}`,
      section: 'Experience',
      url: '/experience',
      text: [
        role.description,
        ...role.impacts.map((i) => `${i.metric}: ${i.description}`),
        role.stack?.join(', ') ?? '',
      ].join(' '),
    });
  }

  for (const group of capabilities) {
    docs.push({
      id: `capability-${group.id}`,
      title: group.title,
      section: 'Stack',
      url: '/stack',
      text: [group.description, ...group.items.map((i) => `${i.name}${i.detail ? `: ${i.detail}` : ''}`)].join(' '),
    });
  }

  for (const project of projects) {
    docs.push({
      id: `project-${project.slug}`,
      title: project.title,
      section: 'Selected Work',
      url: `/work/${project.slug}`,
      text: [project.subtitle, project.summary, project.stack.join(', ')].join(' '),
    });
  }

  for (const stage of roadmap) {
    docs.push({
      id: `roadmap-${stage.id}`,
      title: `Roadmap: ${stage.title}`,
      section: 'Roadmap',
      url: '/roadmap',
      text: [
        `${stage.title} (${stage.status}).`,
        stage.summary,
        `Done: ${stage.items.filter((i) => i.done).map((i) => i.name).join(', ') || 'none yet'}.`,
        `Still learning: ${stage.items.filter((i) => !i.done).map((i) => i.name).join(', ') || 'nothing'}.`,
      ].join(' '),
    });
  }

  for (const caseStudy of getAllCaseStudies()) {
    const fm = caseStudy.frontmatter;
    docs.push({
      id: `case-study-${fm.slug}`,
      title: fm.title,
      section: 'Case Study',
      url: `/work/${fm.slug}`,
      text: [fm.subtitle, fm.problem, fm.outcome, fm.constraints.join(' '), caseStudy.content].join(' '),
    });
  }

  return docs;
}

function getCorpus(): RagDocument[] {
  if (!corpus) corpus = buildCorpus();
  return corpus;
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of', 'and', 'or', 'in', 'on', 'for',
  'with', 'what', 'how', 'why', 'do', 'does', 'did', 'you', 'your', 'i', 'me', 'my', 'it', 'this', 'that',
  'can', 'could', 'would', 'should', 'tell', 'about', 'who', 'whats', "what's",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export interface RagResult {
  id: string;
  title: string;
  section: string;
  url: string;
  excerpt: string;
  score: number;
}

export function searchPortfolio(query: string, limit = 4): RagResult[] {
  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return [];

  const scored = getCorpus().map((doc) => {
    const docTerms = tokenize(`${doc.title} ${doc.text}`);
    const docTermSet = new Set(docTerms);
    let score = 0;
    for (const term of queryTerms) {
      if (docTermSet.has(term)) score += 1;
      else if (docTerms.some((t) => t.startsWith(term) || term.startsWith(t))) score += 0.5;
    }
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc, score }) => ({
      id: doc.id,
      title: doc.title,
      section: doc.section,
      url: doc.url,
      excerpt: doc.text.slice(0, 320).trim(),
      score,
    }));
}
