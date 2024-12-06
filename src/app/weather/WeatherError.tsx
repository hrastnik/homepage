"use client";

export function WeatherError() {
  return (
    <div className="flex-[5] flex">
      <div className="flex-1">
        <p className="text-gray-500 text-center">
          Weather data is not available
        </p>
      </div>
    </div>
  );
}
