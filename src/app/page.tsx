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

export const dynamic = "force-dynamic";

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
                src={"/labineca-qr.svg"}
                alt="Labineca QR"
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
        {/* Live stream 1 Section */}
        <div className="w-[25%] aspect-[560/315] justify-center items-center bg-white shadow-lg rounded-lg p-2">
          <iframe
            className="w-full h-full"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/VQPLiEHV-tM?si=qrB5qlyYn5bvjsGA&controls=0&autoplay=1"
            title="YouTube video player"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore This is default YouTube embed code
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        {/* Live stream 2 Section */}
        <div className="w-[25%] aspect-[560/315] justify-center items-center bg-white shadow-lg rounded-lg p-2">
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
