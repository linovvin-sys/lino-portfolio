import { cn } from '@/lib/utils';

interface TechMarqueeProps {
  items: string[];
  className?: string;
}

/**
 * CSS-only infinite ticker. The track holds the list twice and slides by
 * exactly half its width, so the loop is seamless. Pauses on hover; static
 * under reduced motion. Edges fade out with a mask.
 */
export function TechMarquee({ items, className }: TechMarqueeProps) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="font-display px-6 text-[length:var(--text-xl)] text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-fg)] md:px-8 md:text-[1.75rem]">
            {item}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        'group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]',
        className,
      )}
    >
      <div className="animate-marquee flex w-max group-hover/marquee:[animation-play-state:paused]">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
