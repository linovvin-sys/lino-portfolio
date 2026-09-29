'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { ArrowRight, ArrowUpRight, Check } from '@/components/ui/Icons';
import { submitContact } from '@/app/actions/contact';
import { profile } from '@/content/profile';
import { formatIndex } from '@/lib/utils';

interface ContactProps {
  id?: string;
}

const fieldClass =
  'mt-2 block w-full rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3 text-[15px] text-[var(--color-fg)] ' +
  'placeholder:text-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] transition-[border-color,box-shadow] duration-[var(--dur-fast)] ' +
  'focus:border-[var(--color-fg)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_oklab,var(--color-fg)_8%,transparent)] ' +
  'aria-[invalid=true]:border-[var(--color-accent)]';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending…' : 'Send message'}
      {!pending && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover/button:translate-x-0.5" />
      )}
    </Button>
  );
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-2 text-[13px] text-[var(--color-accent)]">
      {errors[0]}
    </p>
  );
}

export function Contact({ id }: ContactProps) {
  const [state, formAction] = useActionState(submitContact, {
    success: false,
    message: '',
  });

  return (
    <Section id={id} tone="surface">
      <div className="grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-14">
        <div data-reveal className="col-span-12 flex flex-col lg:col-span-5">
          <p className="eyebrow flex items-center gap-3">
            <span className="text-[var(--color-accent)]">{formatIndex(10)}</span>
            <span aria-hidden="true" className="h-px w-6 bg-[var(--color-rule)]" />
            <span>Contact</span>
          </p>
          <h2 className="font-display mt-5 text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-[1] text-[var(--color-fg)]">
            Let&apos;s build something together.
          </h2>
          <p className="mt-6 max-w-md text-[length:var(--text-md)] leading-relaxed text-[var(--color-muted)]">
            Internships, OJT, projects or just talking networking and DevOps. I usually reply within a day.
          </p>

          <div className="mt-10 flex flex-col gap-4 border-t border-[var(--color-rule)] pt-8">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.links.email}`}
                className="link-underline text-[length:var(--text-lg)] text-[var(--color-fg)]"
              >
                {profile.links.email}
              </a>
              <CopyButton textToCopy={profile.links.email} />
            </div>
            {profile.links.calendar && (
              <a
                href={profile.links.calendar}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-1.5 text-[15px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                Or book a 30-minute call
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>

        <div
          data-reveal
          style={{ ['--reveal-delay' as string]: '80ms' }}
          className="col-span-12 lg:col-span-6 lg:col-start-7"
        >
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-bg)] p-6 shadow-[var(--shadow-card)] sm:p-8">
            {state.success ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center" role="status">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-fg)] text-[var(--color-bg)]">
                  <Check className="h-5 w-5" />
                </span>
                <p className="mt-6 max-w-xs text-[length:var(--text-md)] text-[var(--color-fg)]">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-5">
                <input
                  type="text"
                  name="honeypot"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-[var(--color-fg)]">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Lino Dela Cruz"
                      aria-invalid={Boolean(state.errors?.name)}
                      aria-describedby={state.errors?.name ? 'name-error' : undefined}
                      className={fieldClass}
                    />
                    <FieldError id="name-error" errors={state.errors?.name} />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-[var(--color-fg)]">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="lino@company.com"
                      aria-invalid={Boolean(state.errors?.email)}
                      aria-describedby={state.errors?.email ? 'email-error' : undefined}
                      className={fieldClass}
                    />
                    <FieldError id="email-error" errors={state.errors?.email} />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-[var(--color-fg)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="What are you building, and where could I help?"
                    aria-invalid={Boolean(state.errors?.message)}
                    aria-describedby={state.errors?.message ? 'message-error' : undefined}
                    className={`${fieldClass} resize-none`}
                  />
                  <FieldError id="message-error" errors={state.errors?.message} />
                </div>

                {state.message && !state.success && (
                  <p role="alert" className="rounded-[var(--radius-md)] border border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-accent)_7%,transparent)] px-4 py-3 text-sm text-[var(--color-fg)]">
                    {state.message}
                  </p>
                )}

                <div className="flex flex-col-reverse items-stretch justify-between gap-4 pt-1 sm:flex-row sm:items-center">
                  <p className="text-[13px] text-[var(--color-muted)]">No spam, no newsletter. Just a reply.</p>
                  <SubmitButton />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
