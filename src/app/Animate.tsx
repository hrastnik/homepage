"use client";

import { useEffect, useState } from "react";

export function Animate() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (init === false) {
      return;
    }

    function assert(condition: unknown, message: string): asserts condition {
      if (!condition) {
        throw new Error(message);
      }
    }

    const marquees = document.querySelectorAll<HTMLDivElement>(".marquee");
    if (marquees.length === 0) {
      console.warn("No marquee elements found");
      return;
    }

    function processMarquee(marquee: HTMLDivElement) {
      if (marquee.dataset.processed === "true") {
        // Already processed this cycle
        return;
      }

      if (marquee.clientHeight === 0) {
        console.warn("Marquee height is 0, skipping cloning");
        return;
      }

      const marqueeParent = marquee.parentElement as HTMLDivElement;
      assert(marqueeParent, "No marquee parent element found");

      // If the content fits, do nothing
      if (marquee.clientHeight <= marqueeParent.clientHeight) {
        return;
      }

      const firstParent = marquee.parentElement;
      assert(firstParent, "No firstParent element found");
      const parent = firstParent.parentElement as HTMLDivElement;
      assert(parent, "No parent element found");

      const original = marquee.innerHTML;
      marquee.dataset.original = original;
      marquee.innerHTML += original;

      let safety = 30;
      while (marquee.scrollHeight < parent.clientHeight * 2) {
        if (safety-- < 0) {
          console.warn("Safety limit reached, exiting loop");
          break;
        }
        marquee.innerHTML += original;
        marquee.innerHTML += original; // doubled to compensate translateY(-50%) logic
      }

      // Faster speed:
      // const duration = marquee.scrollHeight / 75 + "s";

      // Slower speed:
      const duration = marquee.scrollHeight / 50 + "s";

      marquee.style.animationDuration = duration;
      marquee.dataset.processed = "true";
    }

    marquees.forEach((m) => processMarquee(m));

    function onResize() {
      marquees.forEach((marquee) => {
        const firstParent = marquee.parentElement;
        if (!firstParent) return;
        const parent = firstParent.parentElement as HTMLDivElement | null;
        if (!parent) return;
        const original = marquee.dataset.original || marquee.innerHTML;
        marquee.innerHTML = original; // reset to original
        marquee.dataset.processed = "";
        // Re-run logic for this marquee only
        processMarquee(marquee);
      });
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [init]);
  return <></>;
}
