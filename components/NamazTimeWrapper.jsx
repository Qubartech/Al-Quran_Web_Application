"use client";

import useCity from "@/lib/getLocation";
import NamazTimeCard from "./prayer/NamazTimeCard";

export default function NamazTimeWrapper() {
  const location = useCity();

  return <NamazTimeCard gpsLocation={location} />;
}
