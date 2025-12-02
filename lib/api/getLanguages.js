// export default async function getLanguages() {
//   try {
//     const res = await fetch("https://api.alquran.cloud/v1/edition/language", {
//       next: { revalidate: 60 * 60 }, // cache for 1h if using Next.js fetch caching
//     });
//     if (!res.ok) return [];
//     const json = await res.json();
//     return Array.isArray(json?.data) ? json.data : [];
//   } catch (e) {
//     return [];
//   }
// }
