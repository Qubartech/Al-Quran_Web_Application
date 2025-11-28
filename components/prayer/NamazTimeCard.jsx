"use client";
import React from "react";

const demoTimes = {
  Fajr: "05:10 AM",
  Dhuhr: "12:30 PM",
  Asr: "03:45 PM",
  Maghrib: "05:20 PM",
  Isha: "07:00 PM",
};

const NamazTimeCard = ({ city }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="glass h-auto w-full p-6 rounded-xl text-gray-900 dark:text-gray-100">
      <div className="mb-4 flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Namaz Timings</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {dateStr}
          </span>
        </div>
        <div className="mt-2 text-base font-medium">
          {city ? `City: ${city}` : "City not found"}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {Object.entries(demoTimes).map(([name, time]) => (
          <div
            key={name}
            className="flex justify-between items-center py-3 px-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <span className="font-semibold text-primary">{name}</span>
            <span className="text-sm">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NamazTimeCard;
