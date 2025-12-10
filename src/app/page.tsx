import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Labineca } from "./labineca/Labineca";
import { LabinecaError } from "./labineca/LabinecaError";
import { LabinecaLoading } from "./labineca/LabinecaLoading";
import { Pineta } from "./pineta/Pineta";
import { PinetaError } from "./pineta/PinetaError";
import { PinetaLoading } from "./pineta/PinetaLoading";
import { KebabMamba } from "./kebabmamba/KebabMamba";
import { PitStop } from "./pit-stop/PitStop";
import { Weather } from "./weather/Weather";
import { WeatherError } from "./weather/WeatherError";
import { WeatherLoading } from "./weather/WeatherLoading";
import { Radar } from "./radar/Radar";

export default async function IndexPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-100 text-gray-800 p-1">
      {/* Main content with grid */}
      <div className="parent flex flex-1 gap-2">
        {/* Pineta Section */}
        <ErrorBoundary fallback={<PinetaError />}>
          <Suspense fallback={<PinetaLoading />}>
            <Pineta />
          </Suspense>
        </ErrorBoundary>

        {/* Labineca Section */}
        <ErrorBoundary fallback={<LabinecaError />}>
          <Suspense fallback={<LabinecaLoading />}>
            <Labineca />
          </Suspense>
        </ErrorBoundary>

        {/* Section Veta Njam */}
        <div className="flex flex-1">
          <div className="flex flex-col flex-1 bg-white shadow-lg rounded-lg p-2 overflow-hidden">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Veta Njam
                </h2>
                <a href="tel:+38598587457">
                  <h3 className="text-l font-semibold text-gray-800 mb-2">
                    098 587 457
                  </h3>
                </a>
              </div>
              <img
                src={"/veta-qr.svg"}
                alt="Veta Njam QR"
                className="w-16 h-16"
              />
            </div>

            <div className="flex-1 relative">
              <div className="absolute top-0 left-0 w-full h-full">
                <img
                  src={"/veta-njam-menu.jpg"}
                  alt="Veta Njam Menu"
                  className="w-full h-full object-contain menu-image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Pit Stop */}
        <div className="flex flex-1">
          <PitStop />
        </div>

        {/* Section radar */}
        <Radar />
      </div>

      {/* Bottom row: increased flex weight */}
      <div className="flex mt-2 min-h-[281px] gap-2">
        {/* Kebab Mamba Section */}
        <div className="flex flex-1">
          <KebabMamba />
        </div>
        {/* Weather Section */}
        <ErrorBoundary fallback={<WeatherError />}>
          <Suspense fallback={<WeatherLoading />}>
            <Weather />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
