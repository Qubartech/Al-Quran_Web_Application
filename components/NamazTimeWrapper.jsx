"use client";

import useCity from "@/lib/getLocation";
import NamazTimeCard from "./NamazTimeCard";

export default function NamazTimeWrapper() {
  const city = useCity();

  return <NamazTimeCard city={city} />;
}
