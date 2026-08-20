import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Default values if not provided
    const title = searchParams.get('title') || 'Pressto - Fast, Private Online Tools';
    const description = searchParams.get('description') || 'Convert, compress, and edit files entirely in your browser. 100% private, no uploads.';
    const category = searchParams.get('category') || 'Tools';

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
            backgroundColor: '#0E1116',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo / Brand */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '24px',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <span style={{ fontSize: '48px', fontWeight: 800, color: '#E6EDF3', letterSpacing: '-0.05em' }}>
              Pressto
            </span>
          </div>
          
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#3b82f6',
              padding: '8px 24px',
              borderRadius: '9999px',
              fontSize: '24px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '32px',
            }}
          >
            {category}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.05em',
              marginBottom: '32px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              fontWeight: 500,
              color: '#8B949E',
              lineHeight: 1.4,
              maxWidth: '850px',
            }}
          >
            {description}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.log(`${error}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
