export default async function getSingleSurah(id) {
  const res = await fetch(process.env.API_URL + "/surah/" + id);

  if (!res.ok) {
    throw new Error("Failed to fetch surah list");
  }

  return res.json();
}
