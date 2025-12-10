"use client";

import { useState, useRef, useCallback } from "react";

const IMAGE_ASPECT_RATIO = 1200 / 1688;
const THUMBNAIL_HEIGHT = 80;
const THUMBNAIL_WIDTH = Math.round(THUMBNAIL_HEIGHT * IMAGE_ASPECT_RATIO); // ~57px
const ZOOM_LEVEL = 3; // 300% zoom
const EDGE_PADDING = 10; // % padding from edge for easier corner access

export function PitStop() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [containerAspectRatio, setContainerAspectRatio] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    // Map position with edge padding: EDGE_PADDING% from edge maps to 0/100%
    const x = Math.min(
      100,
      Math.max(0, ((rawX - EDGE_PADDING) / (100 - 2 * EDGE_PADDING)) * 100)
    );
    const y = Math.min(
      100,
      Math.max(0, ((rawY - EDGE_PADDING) / (100 - 2 * EDGE_PADDING)) * 100)
    );

    setPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerAspectRatio(rect.width / rect.height);
    }
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

          {/* Minimap preview - shows current zoom position */}
          {isZoomed && (
            <div
              className="absolute bottom-2 right-2 pointer-events-none border-2 border-white shadow-lg rounded overflow-hidden"
              style={{
                width: THUMBNAIL_WIDTH,
                height: THUMBNAIL_HEIGHT,
              }}
            >
              <img
                src="/pit-stop.jpg"
                alt=""
                className="w-full h-full object-contain bg-gray-100"
                draggable={false}
              />
              {/* Highlight rectangle showing visible zoomed area */}
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20 rounded-sm"
                style={{
                  width: THUMBNAIL_WIDTH / ZOOM_LEVEL,
                  height: THUMBNAIL_HEIGHT / ZOOM_LEVEL,
                  left:
                    (position.x / 100) *
                    (THUMBNAIL_WIDTH - THUMBNAIL_WIDTH / ZOOM_LEVEL),
                  top:
                    (position.y / 100) *
                    (THUMBNAIL_HEIGHT - THUMBNAIL_HEIGHT / ZOOM_LEVEL),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
