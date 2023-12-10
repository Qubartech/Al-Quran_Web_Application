"use client"
import React, { useState, useEffect } from "react";

const CityComponent = () => {
  const [city, setCity] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const { latitude, longitude } = position.coords;

        // Using OpenCage Geocoding API to get city from coordinates
        try {
          const API_KEY = "5095627cb5034881bf175823c4fc82ab"; // Replace with your OpenCage API key
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            const cityData =
              data.results[0].components.city ||
              data.results[0].components.town ||
              data.results[0].components.village;
            if (cityData) {
              setCity(cityData);
            }
          }
        } catch (error) {
          console.error("Error fetching city:", error);
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      <h2>User City</h2>
      {city ? <p>City: {city}</p> : <p>Fetching city...</p>}
    </div>
  );
};

export default CityComponent;
