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
import { DashboardGrid } from "./DashboardGrid";

// Server Component wrapper; all async logic stays in child server components while layout/persistence is delegated to client DashboardGrid.
export default async function IndexPage() {
  return (
    <div className="h-screen max-h-screen bg-gray-100 text-gray-800 p-4">
      <DashboardGrid>
        <div
          key="pineta"
          className="bg-white rounded-lg shadow flex flex-col overflow-hidden"
        >
          <div className="drag-handle cursor-move px-2 py-1 text-xs font-semibold border-b">
            Pineta
          </div>
          <ErrorBoundary fallback={<PinetaError />}>
            <Suspense fallback={<PinetaLoading />}>
              <Pineta />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div
          key="labineca"
          className="bg-white rounded-lg shadow flex flex-col overflow-hidden"
        >
          <div className="drag-handle cursor-move px-2 py-1 text-xs font-semibold border-b">
            Labineca
          </div>
          <ErrorBoundary fallback={<LabinecaError />}>
            <Suspense fallback={<LabinecaLoading />}>
              <Labineca />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div
          key="veta"
          className="bg-white shadow rounded-lg flex flex-col overflow-hidden"
        >
          <div className="drag-handle cursor-move px-2 py-1 text-xs font-semibold border-b">
            Veta Njam
          </div>
          <div className="flex flex-col flex-1 p-2">
            <div className="flex justify-between mb-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Veta Njam
                </h2>
                <a href="tel:+38598587457">
                  <h3 className="text-sm font-semibold text-gray-800">
                    098 587 457
                  </h3>
                </a>
              </div>
              <img
                src="/veta-qr.svg"
                alt="Veta Njam QR"
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 relative">
              <img
                src="/veta-njam-menu.jpg"
                alt="Veta Njam Menu"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
        <div
          key="radar"
          className="bg-white rounded-lg shadow flex flex-col overflow-hidden"
        >
          <div className="drag-handle cursor-move px-2 py-1 text-xs font-semibold border-b">
            Radar
          </div>
          <Radar />
        </div>
        <div
          key="skarproc"
          className="bg-white rounded-lg shadow flex flex-col overflow-hidden"
        >
          <div className="drag-handle cursor-move px-2 py-1 text-xs font-semibold border-b">
            Fast food Škarpoc
          </div>
          <div className="flex-1 space-y-3 p-2 overflow-y-auto text-sm">
            <div className="bg-blue-50 rounded-lg p-2 border-l-4 border-blue-400">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold inline-block mb-1">
                PON
              </span>
              <p>Sočni pileći filet u umaku od gljiva i domaći pire krumpir</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 border-l-4 border-green-400">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold inline-block mb-1">
                UTO
              </span>
              <p>Svježe istarske kobasice kuhane u vino s kapuzom</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-2 border-l-4 border-orange-400">
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold inline-block mb-1">
                SRI
              </span>
              <p>Domaći fuži s junećim gulašom</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 border-l-4 border-purple-400">
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-semibold inline-block mb-1">
                ČET
              </span>
              <p>Tjestenina s plodovima mora</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 border-l-4 border-red-400">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold inline-block mb-1">
                PET
              </span>
              <p>Rižoto sa šugom od sipe</p>
            </div>
          </div>
        </div>
        <div
          key="stream2"
          className="bg-white rounded-lg shadow flex flex-col overflow-hidden"
        >
          <div className="drag-handle cursor-move px-2 py-1 text-xs font-semibold border-b">
            Live stream 2
          </div>
          <div className="flex-1 p-2">
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
        </div>
        <div
          key="weather"
          className="bg-white rounded-lg shadow flex flex-col overflow-hidden"
        >
          <div className="drag-handle cursor-move px-2 py-1 text-xs font-semibold border-b">
            Weather
          </div>
          <ErrorBoundary fallback={<WeatherError />}>
            <Suspense fallback={<WeatherLoading />}>
              <Weather />
            </Suspense>
          </ErrorBoundary>
        </div>
      </DashboardGrid>
      <p className="text-[10px] mt-2 text-gray-500">
        Drag by header bars. Resize using edges. Layout persisted locally.
      </p>
    </div>
  );
}
