import { error } from "next/navigation";

export default async function getSurahList() {
  const res = await fetch(process.env.API_URL + "/surah");

  let surah = await res.json();

  if (!surah) error();
  return surah;
}
