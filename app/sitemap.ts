import { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { lab } from '@/content/lab';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  const staticRoutes = [
    '',
    '/about',
    '/work',
    '/stack',
    '/workflow',
    '/experience',
    '/roadmap',
    '/resources',
    '/lab',
    '/testimonials',
    '/education',
    '/contact',
    '/resume',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const labRoutes = lab.map((entry) => ({
    url: `${baseUrl}/lab/${entry.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes, ...labRoutes];
}
