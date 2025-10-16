import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Labineca } from "./labineca/Labineca";
import { LabinecaError } from "./labineca/LabinecaError";
import { LabinecaLoading } from "./labineca/LabinecaLoading";
import { Pineta } from "./pineta/Pineta";
import { PinetaError } from "./pineta/PinetaError";
import { PinetaLoading } from "./pineta/PinetaLoading";
import { Weather } from "./weather/Weather";
import { WeatherError } from "./weather/WeatherError";
import { WeatherLoading } from "./weather/WeatherLoading";
import { Radar } from "./radar/Radar";

export default async function IndexPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-100 text-gray-800 p-4">
      {/* Main content with grid */}
      <div className="parent flex flex-1 gap-4">
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

        {/* Section radar */}
        <Radar />
      </div>

      <div className="flex mt-4 gap-4">
        {/* Fast food Škarpoc Section */}
        <div className="w-[calc(25%-1.25rem)] aspect-[560/315] bg-white shadow-lg rounded-lg p-4 overflow-y-auto">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Fast food Škarpoc
            </h2>
            <div className="flex-1 space-y-3">
              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                <div className="flex items-center mb-1">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    PON
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Sočni pileći filet u umaku od gljiva i domaći pire krumpir
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                <div className="flex items-center mb-1">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    UTO
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Svježe istarske kobasice kuhane u vino s kapuzom
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                <div className="flex items-center mb-1">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    SRI
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Domaći fuži s junećim gulašom
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-400">
                <div className="flex items-center mb-1">
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    ČET
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Tjestenina s plodovima mora
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-400">
                <div className="flex items-center mb-1">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    PET
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Rižoto sa šugom od sipe
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live stream 2 Section */}
        <div className="w-[calc(25%-0.25rem)] aspect-[560/315] justify-center items-center bg-white shadow-lg rounded-lg p-2">
          <iframe
            className="w-full h-full"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Q7cF-AckYgE?si=JJB9dhp2dJ-wJ_n7&controls=0&autoplay=1"
            title="YouTube video player"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore This is default YouTube embed code
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
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
