export default async function getTranslationEditions() {
  try {
    const res = await fetch(
      "https://api.alquran.cloud/v1/edition/type/translation",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (e) {
    return [];
  }
}
