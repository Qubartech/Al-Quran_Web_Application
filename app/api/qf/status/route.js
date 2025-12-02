import { getQFToken, _qfTokenDebug } from '@/lib/qf/oauth';

export async function GET() {
  try {
    await getQFToken();
    const dbg = _qfTokenDebug();
    // Do not expose token; only metadata
    return new Response(JSON.stringify({ ok: true, ...dbg }), {
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
