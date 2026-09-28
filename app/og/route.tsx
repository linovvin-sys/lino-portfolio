import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { profile } from '@/content/profile';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || profile.name;
    const description = searchParams.get('description') || profile.title;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#EDEAE3', // --color-bone
            padding: '80px',
            fontFamily: 'serif', // Fallback for Instrument Serif
          }}
        >
          <div
            style={{
              fontSize: '40px',
              color: '#8A8781', // --color-muted
              marginBottom: '20px',
              fontFamily: 'monospace',
            }}
          >
            {description}
          </div>
          <div
            style={{
              fontSize: '120px',
              fontWeight: 'normal',
              color: '#0E0E0C', // --color-ink
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response('Failed to generate image', { status: 500 });
  }
}
