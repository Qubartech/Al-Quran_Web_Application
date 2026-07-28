"use client";
import { useState, useEffect } from "react";

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
          const API_KEY = "5095627cb5034881bf175823c4fc82ab"; 
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
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

