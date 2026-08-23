import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const statusUrl = sp.get('status_url');

  if (!statusUrl) {
    return new Response(JSON.stringify({ error: 'Missing status_url' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const statusRes = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '1a7c315d9cmsh54106b1f0d38f22p1037d2jsn6b85d26c5ef8',
        'X-RapidAPI-Host': 'youtube-video-download7.p.rapidapi.com',
        'Cache-Control': 'no-cache'
      }
    });

    if (!statusRes.ok) {
      return new Response(JSON.stringify({ error: `API error: ${statusRes.status}` }), { status: statusRes.status, headers: { 'Content-Type': 'application/json' } });
    }

    const data = await statusRes.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
