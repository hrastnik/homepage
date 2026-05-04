"use client";

import React, { useEffect, useState } from "react";

function parseHeaderHour(label: string) {
  const match = label.trim().match(/^(\d{1,2}):/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function getCurrentForecastTime(now: Date) {
  const formatter = new Intl.DateTimeFormat("hr-HR", {
    timeZone: "Europe/Zagreb",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );

  return {
    hour,
    minute,
    label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

export function CurrentTimeLine() {
  const [linePosition, setLinePosition] = useState<number | null>(null);
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const calculatePosition = () => {
      const tableParent = document.querySelector(".weather-table");
      if (!tableParent) return;

      const table = tableParent.querySelector("table");
      if (!table) return;

      const headers = Array.from(table.querySelectorAll("th[scope='col']"));
      const timeHeaders = headers
        .map((header) => ({
          element: header,
          hour: parseHeaderHour(header.textContent ?? ""),
        }))
        .filter(
          (header): header is { element: HTMLTableCellElement; hour: number } =>
            header.hour !== null,
        );

      if (timeHeaders.length < 2) return;

      const now = new Date();
      const forecastTime = getCurrentForecastTime(now);

      setCurrentTime(forecastTime.label);

      const tableRect = tableParent.getBoundingClientRect();
      const firstHeader = timeHeaders[0];
      const lastHeader = timeHeaders[timeHeaders.length - 1];
      const firstHeaderRect = firstHeader.element.getBoundingClientRect();
      const lastHeaderRect = lastHeader.element.getBoundingClientRect();
      const firstHeaderCenter =
        firstHeaderRect.left - tableRect.left + firstHeaderRect.width / 2;
      const lastHeaderCenter =
        lastHeaderRect.left - tableRect.left + lastHeaderRect.width / 2;
      const totalHours = lastHeader.hour - firstHeader.hour;

      if (totalHours <= 0) return;

      const currentHour = forecastTime.hour;
      const currentMinutes = forecastTime.minute;
      const currentTimeDecimal = currentHour + currentMinutes / 60;
      const normalizedTime =
        (currentTimeDecimal - firstHeader.hour) / totalHours;
      const clampedTime = Math.min(Math.max(normalizedTime, 0), 1);
      const linePosition =
        firstHeaderCenter +
        (lastHeaderCenter - firstHeaderCenter) * clampedTime;

      setLinePosition(linePosition);

      const lastRow = table.querySelector("tr:last-child");
      if (!lastRow) return;

      setLastRowHeight(lastRow.getBoundingClientRect().height);
    };

    calculatePosition();
    const interval = setInterval(() => calculatePosition(), 60000); // Recalculate every minute
    window.addEventListener("resize", calculatePosition);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", calculatePosition);
    };
  }, []);

  if (linePosition === null) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: `${linePosition}px`,
        // lastRowHeight is calculated via getBoundingClientRect()
        // 0.5rem is the margin between the table and the line
        height: `calc(100% - ${lastRowHeight}px - 0.5rem)`,
        width: "1.5px",
        backgroundColor: "#4a90e2",
        boxShadow: "0 0 4px rgba(74, 144, 226, 0.5)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-15px", // Position above the line
          transform: "translateX(-50%)", // Center the label relative to the line
          backgroundColor: "white",
          color: "#4a90e2",
          fontSize: "0.72rem",
          fontWeight: "bold",
          padding: "2px 5px",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
          whiteSpace: "nowrap",
        }}
      >
        {currentTime}
      </div>
    </div>
  );
}
