"use client";

import { useState, useRef, useCallback } from "react";

export function PitStop() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setPosition({ x: 50, y: 50 });
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-white shadow-lg rounded-lg p-2 overflow-hidden">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Pit Stop</h2>
          <a
            href="https://www.instagram.com/pitstop_labin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-l font-semibold text-gray-800 mb-2 hover:text-blue-600">
              @pitstop_labin
            </h3>
          </a>
        </div>
      </div>

      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="absolute top-0 left-0 w-full h-full cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Link wrapper for mobile tap-to-open */}
          <a
            href="/pit-stop.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
            onClick={(e) => {
              // Prevent opening on desktop where hover zoom works
              if (window.matchMedia("(hover: hover)").matches) {
                e.preventDefault();
              }
            }}
          >
            <img
              src="/pit-stop.jpg"
              alt="Pit Stop Menu"
              className="w-full h-full object-contain menu-image"
              draggable={false}
            />
          </a>

          {/* Zoomed overlay - shows on hover (desktop only) */}
          {isZoomed && (
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                backgroundImage: "url(/pit-stop.jpg)",
                backgroundSize: "300%",
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
