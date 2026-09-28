'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { cn } from '@/lib/utils';

interface Source {
  title: string;
  url: string;
}

const SUGGESTED_PROMPTS = ['What is your tech stack?', 'Tell me about your AI projects.', 'Where did you work previously?'];

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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/20 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ask the portfolio AI agent"
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[var(--color-rule)] bg-[var(--color-bg)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
          <span className="font-mono text-xs text-[var(--color-muted)]">Ask me anything</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="py-8 text-center">
              <p className="mb-4 font-mono text-sm text-[var(--color-muted)]">Suggested questions:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => submitPrompt(q)}
                    className="rounded-full border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-fg)] transition-colors hover:bg-[var(--color-rule)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg p-3',
                    m.role === 'user'
                      ? 'bg-[var(--color-fg)] text-[var(--color-bg)]'
                      : 'border border-[var(--color-rule)] bg-[var(--color-surface)] font-body text-[var(--color-fg)]',
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
                        className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] underline decoration-[var(--color-accent)] underline-offset-2 hover:text-[var(--color-fg)]"
                      >
                        [{i + 1}] {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && <div className="animate-pulse font-mono text-sm text-[var(--color-muted)]">Agent is thinking...</div>}
          {error && (
            <div className="font-mono text-sm text-[var(--color-accent)]">
              {isRateLimited ? "You've hit the rate limit — try again in a minute." : 'Something went wrong. Please try again.'}
            </div>
          )}
        </div>

        <form onSubmit={onFormSubmit} className="border-t border-[var(--color-rule)] p-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="w-full border-none bg-transparent font-body text-[var(--color-fg)] outline-none placeholder:text-[var(--color-muted)]"
          />
        </form>

        <div className="flex items-center justify-between border-t border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
          <span>{model ?? 'claude-3-5-haiku'}</span>
          <span className="font-tabular">{latencyMs !== null ? `${latencyMs}ms` : 'Press ESC to close'}</span>
        </div>
      </div>
    </div>
  );
}
