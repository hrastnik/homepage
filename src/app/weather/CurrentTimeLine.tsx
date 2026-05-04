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

function getCurrentForecastDate(now: Date) {
  return new Intl.DateTimeFormat("hr-HR", {
    timeZone: "Europe/Zagreb",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);
}

function normalizeDateKey(value: string) {
  return value.replace(/\D/g, "");
}

function parseTemperature(label: string) {
  const match = label.match(/-?\d+(?:[.,]\d+)?/);

  if (!match) {
    return null;
  }

  return Number(match[0].replace(",", "."));
}

function formatTemperature(value: number) {
  const roundedValue = Math.round(value * 10) / 10;
  const hasFraction = Math.abs(roundedValue % 1) > Number.EPSILON;

  return `${hasFraction ? roundedValue.toFixed(1) : roundedValue.toFixed(0)} °C`;
}

function getInterpolatedTemperature(
  table: HTMLTableElement,
  timeHeaders: Array<{ element: HTMLTableCellElement; hour: number }>,
  currentDateLabel: string,
  currentTimeDecimal: number,
) {
  const dayRows = Array.from(
    table.querySelectorAll("th[scope='row'][rowspan='3']"),
  );
  const currentDateKey = normalizeDateKey(currentDateLabel);
  const currentDayHeader = dayRows.find((header) =>
    normalizeDateKey(header.textContent ?? "").includes(currentDateKey),
  );

  if (!(currentDayHeader instanceof HTMLTableCellElement)) {
    return null;
  }

  const iconRow = currentDayHeader.parentElement;
  const temperatureRow = iconRow?.nextElementSibling;

  if (!(temperatureRow instanceof HTMLTableRowElement)) {
    return null;
  }

  const temperatureCells = Array.from(temperatureRow.querySelectorAll("td"));
  const temperatureEntries = timeHeaders
    .map(({ hour }, index) => ({
      hour,
      temperature: parseTemperature(temperatureCells[index]?.textContent ?? ""),
    }))
    .filter(
      (entry): entry is { hour: number; temperature: number } =>
        entry.temperature !== null,
    );

  if (temperatureEntries.length === 0) {
    return null;
  }

  const exactEntry = temperatureEntries.find(
    (entry) => Math.abs(entry.hour - currentTimeDecimal) < 1 / 60,
  );

  if (exactEntry) {
    return exactEntry.temperature;
  }

  let leftEntry: { hour: number; temperature: number } | null = null;
  let rightEntry: { hour: number; temperature: number } | null = null;

  for (const entry of temperatureEntries) {
    if (entry.hour <= currentTimeDecimal) {
      leftEntry = entry;
    }

    if (entry.hour >= currentTimeDecimal) {
      rightEntry = entry;
      break;
    }
  }

  if (leftEntry && rightEntry) {
    if (leftEntry.hour === rightEntry.hour) {
      return leftEntry.temperature;
    }

    const progress =
      (currentTimeDecimal - leftEntry.hour) /
      (rightEntry.hour - leftEntry.hour);

    return (
      leftEntry.temperature +
      (rightEntry.temperature - leftEntry.temperature) * progress
    );
  }

  return leftEntry?.temperature ?? rightEntry?.temperature ?? null;
}

export function CurrentTimeLine() {
  const [linePosition, setLinePosition] = useState<number | null>(null);
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentTemperature, setCurrentTemperature] = useState<string | null>(
    null,
  );

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
      const forecastDate = getCurrentForecastDate(now);

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
      const interpolatedTemperature = getInterpolatedTemperature(
        table,
        timeHeaders,
        forecastDate,
        currentTimeDecimal,
      );

      const normalizedTime =
        (currentTimeDecimal - firstHeader.hour) / totalHours;
      const clampedTime = Math.min(Math.max(normalizedTime, 0), 1);
      const linePosition =
        firstHeaderCenter +
        (lastHeaderCenter - firstHeaderCenter) * clampedTime;

      setCurrentTemperature(
        interpolatedTemperature === null
          ? null
          : formatTemperature(interpolatedTemperature),
      );
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1px",
        }}
      >
        <span>{currentTime}</span>
        {currentTemperature ? (
          <span style={{ fontSize: "0.68rem" }}>{currentTemperature}</span>
        ) : null}
      </div>
    </div>
  );
}
