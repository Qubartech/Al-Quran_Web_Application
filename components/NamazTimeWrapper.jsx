"use client";

import useCity from "@/lib/getLocation";
import NamazTimeCard from "./prayer/NamazTimeCard";

export default function NamazTimeWrapper({ className = "" }) {
  const location = useCity();

  return <NamazTimeCard gpsLocation={location} className={className} />;
}
