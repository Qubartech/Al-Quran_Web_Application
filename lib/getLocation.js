"use client";
import { useState, useEffect } from "react";

const useCity = () => {
  const [city, setCity] = useState("");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const API_KEY = "5095627cb5034881bf175823c4fc82ab"; 
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
        );

        const data = await response.json();

        if (data.results.length > 0) {
          const components = data.results[0].components;
          const cityName =
            components.city ||
            components.town ||
            components.village ||
            "";

          setCity(cityName);
        }
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    });
  }, []);

  return city;
};

export default useCity;
