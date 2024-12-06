"use client";

import { useEffect, useState } from "react";

export function Radar() {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(function refreshRadarEffect() {
    const id = setInterval(function refreshRadar() {
      setCurrentTime(Date.now());
      // Refresh every 5 minutes
    }, 5 * 60 * 1000);

    return function clearRadarInterval() {
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col relative bg-white shadow-lg rounded-lg p-2">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Radar</h2>

      <div className="relative flex-1">
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={`https://vrijeme.hr/anim_goli.gif?t=${currentTime}`}
            alt="Vrijeme"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
