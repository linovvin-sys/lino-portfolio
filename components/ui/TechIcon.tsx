import { techIcons } from '@/content/tech-icons';

interface TechIconProps {
  slug: string;
  className?: string;
}

/** Renders a brand mark from techIcons monochrome via currentColor. Renders nothing for an unknown slug. */
export function TechIcon({ slug, className }: TechIconProps) {
  const path = techIcons[slug];
  if (!path) return null;

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
