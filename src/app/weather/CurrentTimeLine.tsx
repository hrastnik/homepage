"use client";

import React, { useEffect, useState } from "react";

export function CurrentTimeLine() {
  const [linePosition, setLinePosition] = useState<number | null>(null);
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const calculatePosition = () => {
      const table = document.querySelector(".fd-c-table");
      if (!table) return;

      const headers = table.querySelectorAll("th[scope='col']");
      if (headers.length < 2) return; // Ensure at least two columns for calculation

      const now = new Date(); // Use a fixed date to avoid issues with time zones

      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) // Update the label to show current time
      );

      // Get the position of the left side of the "1:00" cell and the right side of the "22:00" cell
      // First column is the empty cell, so we start from the second column
      const column1AM = headers[1];
      const column22PM = headers[headers.length - 1];
      const column1AMRect = column1AM.getBoundingClientRect();
      const column22PMRect = column22PM.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();

      const offsetOf1AM = column1AMRect.left - tableRect.left;
      const widthOfTime = column22PMRect.right - column1AMRect.left;

      // Calculate the line's position as a percentage between the 1:00 column and 22:00 column
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeDecimal = currentHour + currentMinutes / 60; // Current time as a decimal (e.g., 11.5 for 11:30)

      const linePosition =
        offsetOf1AM + (currentTimeDecimal / 24) * widthOfTime;
      setLinePosition(linePosition);

      const lastRow = table.querySelector("tr:last-child");
      setLastRowHeight(lastRow!.getBoundingClientRect().height);
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
          fontSize: "12px",
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
