import { qfContentFetch } from '@/lib/qf/content';

export async function GET(request, { params }) {
  const id = params?.id;
  if (!id || isNaN(Number(id))) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid chapter id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const path = language
      ? `/content/api/v4/chapters/${encodeURIComponent(id)}?language=${encodeURIComponent(language)}`
      : `/content/api/v4/chapters/${encodeURIComponent(id)}`;
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
