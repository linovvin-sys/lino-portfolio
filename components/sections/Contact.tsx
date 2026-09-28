'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { MagneticWrap } from '@/components/ui/MagneticWrap';
import { Grid } from '@/components/ui/Grid';
import { submitContact } from '@/app/actions/contact';
import { profile } from '@/content/profile';

interface ContactProps {
  id?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full md:w-auto"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export function Contact({ id }: ContactProps) {
  const [state, formAction] = useActionState(submitContact, {
    success: false,
    message: '',
  });

  return (
    <section id={id} className="py-24 md:py-32 bg-[var(--color-bg)] text-[var(--color-fg)] border-t border-[var(--color-rule)]">
      <Container>
        <Grid className="gap-16">
          {/* Left Column: CTA & Info */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-5xl md:text-7xl leading-none mb-8">
                Let&apos;s build<br />something.
              </h2>

              <div className="flex flex-col items-start gap-4 mb-12">
                <MagneticWrap>
                  <div className="flex items-center gap-4 group">
                    <span className="font-mono text-lg group-hover:text-[var(--color-accent)] transition-colors">{profile.links.email}</span>
                    <CopyButton textToCopy={profile.links.email} />
                  </div>
                </MagneticWrap>

                {profile.links.calendar && (
                  <MagneticWrap>
                    <a
                      href={profile.links.calendar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-lg hover:text-[var(--color-accent)] transition-colors border-b border-[var(--color-rule)] hover:border-[var(--color-accent)] pb-1"
                    >
                      Schedule a call →
                    </a>
                  </MagneticWrap>
                )}
              </div>
            </div>

            <div className="font-mono text-xs text-[var(--color-muted)] flex flex-col gap-2 border-t border-[var(--color-rule)] pt-6 mt-8 md:mt-0">
              <div className="flex justify-between">
                <span>Timezone:</span>
                <span>{profile.timezone}</span>
              </div>
              <div className="flex justify-between">
                <span>Typical response:</span>
                <span>Within 24 hours</span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Form */}
          <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7 bg-[var(--color-surface)] p-8 md:p-12 border border-[var(--color-rule)]">
            <h3 className="font-mono text-sm uppercase tracking-widest mb-8">Direct Message</h3>
            
            {state.success ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-code-bg)] flex items-center justify-center mb-6">
                  <span className="text-2xl">✓</span>
                </div>
                <p className="font-mono text-lg">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                {/* Honeypot */}
                <input 
                  type="text" 
                  name="honeypot" 
                  className="hidden" 
                  tabIndex={-1} 
                  autoComplete="off" 
                />
                
                <div className="space-y-2">
                  <label htmlFor="name" className="font-mono text-sm block text-[var(--color-muted)]">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    className="w-full bg-transparent border-b border-[var(--color-rule)] px-0 py-3 font-body focus:outline-none focus:border-[var(--color-fg)] transition-colors rounded-none"
                    placeholder="Jane Doe"
                  />
                  {state.errors?.name && <p className="font-mono text-xs text-[var(--color-accent)] mt-1">{state.errors.name[0]}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="font-mono text-sm block text-[var(--color-muted)]">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full bg-transparent border-b border-[var(--color-rule)] px-0 py-3 font-body focus:outline-none focus:border-[var(--color-fg)] transition-colors rounded-none"
                    placeholder="jane@example.com"
                  />
                  {state.errors?.email && <p className="font-mono text-xs text-[var(--color-accent)] mt-1">{state.errors.email[0]}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="font-mono text-sm block text-[var(--color-muted)]">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    rows={4}
                    className="w-full bg-transparent border-b border-[var(--color-rule)] px-0 py-3 font-body focus:outline-none focus:border-[var(--color-fg)] transition-colors resize-none rounded-none"
                    placeholder="How can we work together?"
                  />
                  {state.errors?.message && <p className="font-mono text-xs text-[var(--color-accent)] mt-1">{state.errors.message[0]}</p>}
                </div>
                
                {state.message && !state.success && (
                  <p className="font-mono text-xs text-[var(--color-accent)]">{state.message}</p>
                )}
                
                <div className="pt-4 flex justify-end">
                  <SubmitButton />
                </div>
              </form>
            )}
          </div>
        </Grid>
      </Container>
    </section>
  );
}
