import { error } from "next/navigation";

export default async function getSingleSurah(id) {
  const res = await fetch(
    process.env.API_URL +
      `/surah/${id}/editions/quran-uthmani,bn.bengali,ar.alafasy`
  );

  let surah = await res.json();

  if (!surah) error();
  return surah;
}
