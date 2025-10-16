"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Cast responsive component to satisfy React 19 RC typing quirks
const ResponsiveGridLayout = WidthProvider(
  Responsive as any
) as unknown as React.FC<any>;

const LAYOUT_STORAGE_KEY = "dashboard.layout.v1";

type SavedLayouts = {
  lg?: Layout[];
  md?: Layout[];
  sm?: Layout[];
  xs?: Layout[];
  xxs?: Layout[];
};

// Default layout definition
const defaultLayouts: Layouts = {
  lg: [
    { i: "pineta", x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 6 },
    { i: "labineca", x: 3, y: 0, w: 3, h: 12, minW: 2, minH: 6 },
    { i: "veta", x: 6, y: 0, w: 3, h: 12, minW: 2, minH: 6 },
    { i: "radar", x: 9, y: 0, w: 3, h: 12, minW: 2, minH: 6 },
    { i: "skarproc", x: 0, y: 12, w: 3, h: 10, minW: 2, minH: 6 },
    { i: "stream2", x: 3, y: 12, w: 3, h: 10, minW: 2, minH: 6 },
    { i: "weather", x: 6, y: 12, w: 6, h: 10, minW: 3, minH: 6 },
  ],
};

function isValidLayoutItem(item: Layout): boolean {
  return (
    typeof item.i === "string" &&
    typeof item.x === "number" &&
    item.x >= 0 &&
    typeof item.y === "number" &&
    item.y >= 0 &&
    typeof item.w === "number" &&
    item.w >= 1 &&
    item.w <= 12 &&
    typeof item.h === "number" &&
    item.h >= 1
  );
}

function validateLayouts(l: Layouts | null): Layouts | null {
  if (!l) return null;
  const requiredKeys = [
    "pineta",
    "labineca",
    "veta",
    "radar",
    "skarproc",
    "stream2",
    "weather",
  ];
  const lg = l.lg;
  if (!lg) return null;
  const ids = new Set(lg.map((it) => it.i));
  for (const key of requiredKeys) if (!ids.has(key)) return null;
  if (!lg.every(isValidLayoutItem)) return null;
  return l;
}

function loadLayoutsFromStorage(): Layouts | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: SavedLayouts = JSON.parse(raw);
    const merged: Layouts = { ...defaultLayouts, ...parsed };
    return validateLayouts(merged);
  } catch {
    return null;
  }
}

function saveLayouts(layouts: Layouts) {
  if (typeof window === "undefined") return;
  const toSave: SavedLayouts = {
    lg: layouts.lg,
    md: layouts.md,
    sm: layouts.sm,
    xs: layouts.xs,
    xxs: layouts.xxs,
  };
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(toSave));
}

interface DashboardGridProps {
  children: React.ReactNode;
}

export function DashboardGrid({ children }: DashboardGridProps) {
  // Start with defaults on server render; replace with persisted layout on client after mount.
  const [layouts, setLayouts] = useState<Layouts>(defaultLayouts);

  useEffect(() => {
    const stored = loadLayoutsFromStorage();
    if (stored) {
      setLayouts(stored);
    } else {
      // If corrupted layout existed, clear it so we don't keep failing silently.
      window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
    }
  }, []); // run once after mount

  const onLayoutChange = useCallback((_current: Layout[], all: Layouts) => {
    setLayouts(all);
    saveLayouts(all);
  }, []);

  const resetLayout = () => {
    setLayouts(defaultLayouts);
    saveLayouts(defaultLayouts);
  };

  return (
    <>
      <div className="flex mb-2 gap-2">
        <button
          onClick={resetLayout}
          className="px-3 py-1 text-sm bg-white shadow rounded border hover:bg-gray-50"
        >
          Reset layout
        </button>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={20}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        resizeHandles={["se", "e", "w", "sw", "ne", "n", "s"]}
        isBounded={false}
        compactType="vertical"
        preventCollision={false}
      >
        {children}
      </ResponsiveGridLayout>
    </>
  );
}

// Export defaults to allow future customization from page if desired
export const DASHBOARD_DEFAULT_LAYOUTS = defaultLayouts;
