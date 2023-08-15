export default async function getSurahList() {
  const res = await fetch(process.env.API_URL + "/surah");

  if (!res.ok) {
    throw new Error("Failed to fetch surah list");
  }

  return res.json();
}
