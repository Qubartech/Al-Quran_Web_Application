"use client";
import { useState, useEffect } from "react";
import { OPENCAGE_API_BASE_URL, OPENCAGE_API_KEY } from "./api/config";

export function normalizeLocation(loc) {
  if (!loc) {
    return {
      city: "Dhaka",
      country: "Bangladesh",
      latitude: 23.8103,
      longitude: 90.4125,
      isGps: false,
    };
  }

  let city = "Dhaka";
  let country = "Bangladesh";
  let latitude = null;
  let longitude = null;
  let isGps = false;

  if (typeof loc === "string") {
    city = loc;
  } else if (typeof loc === "object" && loc !== null) {
    if (typeof loc.city === "string") {
      city = loc.city;
    } else if (typeof loc.city === "object" && loc.city !== null) {
      // Unpack nested city object
      city = typeof loc.city.city === "string" ? loc.city.city : "Dhaka";
      if (!country && typeof loc.city.country === "string") country = loc.city.country;
      if (latitude === null && typeof loc.city.latitude === "number") latitude = loc.city.latitude;
      if (longitude === null && typeof loc.city.longitude === "number") longitude = loc.city.longitude;
    }

    if (typeof loc.country === "string") {
      country = loc.country;
    } else if (typeof loc.country === "object" && loc.country !== null && typeof loc.country.country === "string") {
      country = loc.country.country;
    }

    if (typeof loc.latitude === "number") latitude = loc.latitude;
    if (typeof loc.longitude === "number") longitude = loc.longitude;
    if (typeof loc.isGps === "boolean") isGps = loc.isGps;
  }

  return {
    city: String(city || "Dhaka"),
    country: String(country || ""),
    latitude,
    longitude,
    isGps,
  };
}

const useCity = () => {
  const [location, setLocation] = useState({
    city: "",
    country: "",
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation({
        city: "",
        country: "",
        latitude: null,
        longitude: null,
        loading: false,
        error: "Geolocation is not supported by this browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `${OPENCAGE_API_BASE_URL}?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
          );

          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const components = data.results[0].components;
            const cityName =
              components.city ||
              components.town ||
              components.village ||
              components.suburb ||
              "";
            const countryName = components.country || "";

            setLocation({
              city: cityName,
              country: countryName,
              latitude,
              longitude,
              loading: false,
              error: null,
            });
          } else {
            setLocation({
              city: "",
              country: "",
              latitude,
              longitude,
              loading: false,
              error: "No geocoding results found.",
            });
          }
        } catch (error) {
          console.error("Error fetching city:", error);
          setLocation({
            city: "",
            country: "",
            latitude,
            longitude,
            loading: false,
            error: "Failed to resolve city name.",
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMsg = "Geolocation access denied or failed.";
        if (error.code === 1) {
          errorMsg = "Geolocation permission denied.";
        } else if (error.code === 2) {
          errorMsg = "Position unavailable.";
        } else if (error.code === 3) {
          errorMsg = "Geolocation timeout.";
        }
        setLocation({
          city: "",
          country: "",
          latitude: null,
          longitude: null,
          loading: false,
          error: errorMsg,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return location;
};

export default useCity;
