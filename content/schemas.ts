/**
 * Content Schemas — Zod validation for all portfolio content.
 *
 * Every content file imports its schema from here.
 * Components use z.infer<typeof Schema> for props.
 * The build fails on invalid content.
 */

import { z } from "zod";

/* ── Primitives ──────────────────────────────────── */

export const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  icon: z.enum(["github", "linkedin", "x", "email", "web", "pdf", "calendar"]).optional(),
});

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blurDataURL: z.string().optional(),
});

const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  numericValue: z.number().optional(),
});

const dateRangeSchema = z.object({
  start: z.string(),
  end: z.string().or(z.literal("Present")),
});

/* ── Profile ─────────────────────────────────────── */

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  timezone: z.string(),
  tagline: z.string().max(160),
  bio: z.string(),
  portrait: imageSchema.optional(),
  availability: z.object({
    status: z.enum(["available", "limited", "unavailable"]),
    message: z.string(),
  }),
  links: z.object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    x: z.string().url().optional(),
    email: z.string().email(),
    resume: z.string().optional(),
    calendar: z.string().url().optional(),
  }),
  principles: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).min(3).max(6),
});

/* ── Projects ────────────────────────────────────── */

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  index: z.number().int().min(1),
  title: z.string(),
  subtitle: z.string(),
  category: z.string(),
  year: z.string(),
  client: z.string().optional(),
  thumbnail: imageSchema,
  heroImage: imageSchema.optional(),
  color: z.string().optional(),
  featured: z.boolean().default(true),
  stack: z.array(z.string()),
  metrics: z.array(metricSchema).optional(),
  summary: z.string(),
  externalUrl: z.string().url().optional(),
});

export const projectsSchema = z.array(projectSchema).min(1);

/* ── Case Study Frontmatter ──────────────────────── */

export const caseStudyFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  category: z.string(),
  year: z.string(),
  client: z.string().optional(),
  role: z.string(),
  duration: z.string(),
  team: z.string().optional(),
  heroImage: imageSchema.optional(),
  stack: z.array(z.string()),
  problem: z.string(),
  constraints: z.array(z.string()),
  outcome: z.string(),
  metrics: z.array(metricSchema),
  architectureSvg: z.string().optional(),
  published: z.boolean().default(true),
});

/* ── Capabilities ────────────────────────────────── */

export const capabilityGroupSchema = z.object({
  id: z.string(),
  index: z.number().int().min(1),
  title: z.string(),
  description: z.string(),
  items: z.array(z.object({
    name: z.string(),
    detail: z.string().optional(),
  })).min(1),
});

export const capabilitiesSchema = z.array(capabilityGroupSchema).min(3);

/* ── Experience ──────────────────────────────────── */

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string(),
  type: z.enum(["full-time", "contract", "freelance", "research"]),
  period: dateRangeSchema,
  description: z.string(),
  impacts: z.array(z.object({
    metric: z.string(),
    description: z.string(),
  })).min(1).max(4),
  stack: z.array(z.string()).optional(),
});

export const experienceListSchema = z.array(experienceSchema).min(1);

/* ── Writing & Research ──────────────────────────── */

export const writingSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["paper", "blog", "talk", "podcast", "workshop"]),
  venue: z.string().optional(),
  date: z.string(),
  url: z.string().url().optional(),
  description: z.string(),
  featured: z.boolean().default(false),
});

export const writingListSchema = z.array(writingSchema).min(1);

/* ── Open Source ──────────────────────────────────── */

export const ossProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  language: z.string(),
  stars: z.number().int().min(0),
  url: z.string().url(),
  purpose: z.string(),
  featured: z.boolean().default(false),
});

export const ossListSchema = z.array(ossProjectSchema).min(1);

/* ── Testimonials ────────────────────────────────── */

export const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string(),
  relationship: z.string().optional(),
  featured: z.boolean().default(false),
});

export const testimonialsSchema = z.array(testimonialSchema).min(1);

/* ── Lab Experiments ─────────────────────────────── */

export const labExperimentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum([
    "tokenizer",
    "embeddings",
    "attention",
    "rag",
    "prompting",
    "inference",
  ]),
  component: z.string(),
  status: z.enum(["live", "wip", "planned"]),
  techStack: z.array(z.string()),
});

export const labListSchema = z.array(labExperimentSchema).min(1);

/* ── Education ───────────────────────────────────── */

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  period: dateRangeSchema,
  honors: z.string().optional(),
});

export const educationListSchema = z.array(educationSchema).min(1);

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string().url().optional(),
  credentialId: z.string().optional(),
});

export const certificationsSchema = z.array(certificationSchema);

/* ── Metrics Strip ───────────────────────────────── */

export const metricsStripSchema = z.array(metricSchema).min(3).max(8);

/* ── Navigation ──────────────────────────────────── */

export const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  index: z.string().regex(/^\d{2}$/),
});

export const navigationSchema = z.array(navItemSchema);

/* ── Inferred Types ──────────────────────────────── */

export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;
export type CapabilityGroup = z.infer<typeof capabilityGroupSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Writing = z.infer<typeof writingSchema>;
export type OSSProject = z.infer<typeof ossProjectSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type LabExperiment = z.infer<typeof labExperimentSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type NavItem = z.infer<typeof navItemSchema>;
export type Link = z.infer<typeof linkSchema>;
export type ImageData = z.infer<typeof imageSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
