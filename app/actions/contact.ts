'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { env } from '@/lib/env';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message is too short').max(5000),
  honeypot: z.string().max(0),
});

export type ContactState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headerList.get('x-real-ip') ?? 'anonymous';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now >= entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= env.CONTACT_RATE_LIMIT_PER_HOUR) return true;

  entry.count++;
  return false;
}

export async function submitContact(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return {
      success: false,
      message: "You've sent a few messages already — please try again in a bit.",
    };
  }

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    honeypot: formData.get('honeypot'),
  };

  const result = contactSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Honeypot field should always be empty — a filled one means a bot filled the form.
  if (result.data.honeypot.length > 0) {
    return {
      success: true,
      message: 'Message sent successfully.',
    };
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    console.error('Contact form submitted but RESEND_API_KEY / CONTACT_EMAIL are not configured.');
    return {
      success: false,
      message: 'An error occurred: the contact form is not fully configured yet. Please reach out by email directly.',
    };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <portfolio@resend.dev>',
      to: env.CONTACT_EMAIL,
      replyTo: result.data.email,
      subject: `New message from ${result.data.name}`,
      text: `${result.data.message}\n\n— ${result.data.name} (${result.data.email})`,
    });

    if (error) throw error;

    return {
      success: true,
      message: "Thank you — your message is sent. I'll get back to you soon.",
    };
  } catch (error) {
    console.error('Resend send failed:', error);
    return {
      success: false,
      message: 'An error occurred while sending your message. Please try again later.',
    };
  }
}
