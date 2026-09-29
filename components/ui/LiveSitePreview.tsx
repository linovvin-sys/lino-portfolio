import Image from 'next/image';
import { ArrowUpRight } from '@/components/ui/Icons';
import type { ImageData } from '@/content/schemas';

interface LiveSitePreviewProps {
  url: string;
  screenshot: ImageData;
}

export function LiveSitePreview({ url, screenshot }: LiveSitePreviewProps) {
  const host = new URL(url).host;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-12 block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)]"
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-rule)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-rule)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-rule)]" />
        </span>
        <span className="ml-2 inline-flex min-w-0 items-center gap-1.5 truncate text-xs text-[var(--color-muted)] group-hover:text-[var(--color-fg)]">
          <span className="truncate">{host}</span>
          <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full bg-[var(--color-bg)]">
        <Image
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.02]"
        />
      </div>
    </a>
  );
}
