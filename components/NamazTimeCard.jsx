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
    <div className="h-auto w-100 my-6 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="mb-2 flex flex-col gap-4 justify-between items-center">
        <h2 className="text-lg font-bold">Namaz Timings</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {dateStr}
        </span>
      </div>
      <div className="mb-4 text-base font-medium">
        {city ? `City: ${city}` : "City not found"}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(demoTimes).map(([name, time]) => (
          <div
            key={name}
            className="flex flex-row justify-between items-center py-2 px-3 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <span className="font-semibold text-primary">{name}</span>
            <span className="text-sm mt-1">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NamazTimeCard;
