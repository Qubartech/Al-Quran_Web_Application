export async function getQFChapter(id, language = "en") {
  if (!id) throw new Error("chapter id is required");
  const url = `/api/qf/chapters/${encodeURIComponent(id)}${language ? `?language=${encodeURIComponent(language)}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch chapter ${id}: ${res.status}`);
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || `Chapter ${id} request failed`);
  return data.chapter || data; // some APIs return {chapter: {...}}
}
