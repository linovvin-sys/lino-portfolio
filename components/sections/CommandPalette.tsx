'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { cn } from '@/lib/utils';
import { ArrowRight, Close, Sparkle } from '@/components/ui/Icons';
import { OPEN_PALETTE_EVENT } from './Nav';

interface Source {
  title: string;
  url: string;
}

const SUGGESTED_PROMPTS = [
  'What is your automation stack?',
  'How do you roll out network changes safely?',
  'Where did you work previously?',
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const requestStartedAt = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      const sourcesHeader = response.headers.get('X-Chat-Sources');
      const modelHeader = response.headers.get('X-Chat-Model');
      if (sourcesHeader) {
        try {
          setSources(JSON.parse(sourcesHeader) as Source[]);
        } catch {
          setSources([]);
        }
      }
      if (modelHeader) setModel(modelHeader);
      if (requestStartedAt.current) {
        setLatencyMs(Math.round(performance.now() - requestStartedAt.current));
      }
    },
  });

  const isRateLimited = error?.message?.toLowerCase().includes('rate limit') ?? false;

  const submitPrompt = useCallback(
    (prompt: string) => {
      requestStartedAt.current = performance.now();
      setLatencyMs(null);
      void append({ role: 'user', content: prompt });
    },
    [append],
  );

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    requestStartedAt.current = performance.now();
    setLatencyMs(null);
    handleSubmit(e);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const open = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent
      className="animate-overlay-in fixed inset-0 z-[var(--z-modal)] flex items-start justify-center bg-[color-mix(in_oklab,var(--color-ink)_28%,transparent)] px-4 pt-[12vh] backdrop-blur-[2px] sm:px-6"
      onClick={() => setIsOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ask the portfolio AI agent"
        className="animate-dialog-in flex max-h-[76vh] w-full max-w-xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-bg)] shadow-[var(--shadow-pop)]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onFormSubmit} className="flex items-center gap-3 border-b border-[var(--color-rule)] px-4">
          <Sparkle className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about my work, stack or experience…"
            aria-label="Ask a question"
            className="h-14 w-full min-w-0 bg-transparent text-[15px] text-[var(--color-fg)] outline-none placeholder:text-[var(--color-muted)] focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-subtle)] hover:text-[var(--color-fg)]"
            aria-label="Close"
          >
            <Close className="h-4 w-4" />
          </button>
        </form>

        <div className="flex-1 space-y-4 overflow-y-auto p-3">
          {messages.length === 0 ? (
            <div>
              <p className="eyebrow px-3 pb-2 pt-1">Try asking</p>
              <ul>
                {SUGGESTED_PROMPTS.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => submitPrompt(q)}
                      className="group flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-2.5 text-left text-[15px] text-[var(--color-fg)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--color-subtle)]"
                    >
                      {q}
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--color-muted)] opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap rounded-[var(--radius-md)] px-3.5 py-2.5 text-[15px] leading-relaxed',
                    m.role === 'user'
                      ? 'bg-[var(--color-fg)] text-[var(--color-bg)]'
                      : 'border border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-fg)]',
                  )}
                >
                  {m.content}
                </div>
                {m.role === 'assistant' && sources.length > 0 && m.id === messages[messages.length - 1]?.id && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sources.map((s, i) => (
                      <a
                        key={s.url + i}
                        href={s.url}
                        onClick={() => setIsOpen(false)}
                        className="rounded-full border border-[var(--color-rule)] px-2.5 py-1 text-[12px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
                      >
                        [{i + 1}] {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && <div className="animate-pulse px-1 text-sm text-[var(--color-muted)]">Thinking…</div>}
          {error && (
            <div className="px-1 text-sm text-[var(--color-accent)]">
              {isRateLimited ? "You've hit the rate limit — try again in a minute." : 'Something went wrong. Please try again.'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-2.5 text-[12px] text-[var(--color-muted)]">
          <span className="truncate">{model ?? 'Answers are grounded in my case studies'}</span>
          <span className="font-tabular shrink-0">
            {latencyMs !== null ? (
              `${latencyMs}ms`
            ) : (
              <>
                <kbd className="font-mono">Esc</kbd> to close
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
