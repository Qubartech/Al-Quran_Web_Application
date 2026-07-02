import { qfContentFetch } from '@/lib/qf/content';

export async function GET(request, { params }) {
  const reciterId = params?.id;
  const chapter = params?.chapter_number;
  if (!reciterId || isNaN(Number(reciterId))) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid reciter id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!chapter || isNaN(Number(chapter))) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid chapter number' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const segments = searchParams.get('segments');
    const qs = segments != null ? `?segments=${encodeURIComponent(segments)}` : '';
    const path = `/content/api/v4/chapter_recitations/${encodeURIComponent(reciterId)}/${encodeURIComponent(chapter)}${qs}`;

    const res = await qfContentFetch(path);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return new Response(JSON.stringify({ ok: false, status: res.status, error: text }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify({ ok: true, ...data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
