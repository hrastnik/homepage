"use client";

import { useEffect } from "react";

export function Animate() {
  useEffect(() => {
    console.log("HERE");

    function assert(condition: unknown, message: string): asserts condition {
      if (!condition) {
        throw new Error(message);
      }
    }

    const marquee = document.querySelector<HTMLDivElement>(".marquee");
    assert(marquee != null, "No marquee element found");

    if (marquee.clientHeight === 0) {
      console.warn("Marquee height is 0, skipping cloning");
      return;
    }

    const marqueeParent = marquee.parentElement as HTMLDivElement;
    assert(marqueeParent, "No marquee parent element found");

    // If the content fits, do nothing
    if (marquee.clientHeight <= marqueeParent.clientHeight) {
      console.log("Marquee content fits, skipping cloning");
      return;
    }

    const firstParent = marquee.parentElement;
    assert(firstParent, "No firstParent element found");
    const parent = firstParent.parentElement;
    assert(parent, "No parent element found");

    const innerItems = marquee.innerHTML;
    marquee.innerHTML += innerItems;

    let safety = 30;
    while (marquee.scrollHeight < parent.clientHeight * 2) {
      if (safety-- < 0) {
        console.warn("Safety limit reached, exiting loop");
        break;
      }

      // We need to double the inner items beacuse we are using translateY(-50%)
      // Otherwise, the marquee would glitch when it reaches the middle point
      marquee.innerHTML += innerItems;
      marquee.innerHTML += innerItems;
    }

    const setAnimationDuration = () => {
      const duration = marquee.scrollHeight / 75 + "s";
      marquee.style.animationDuration = duration;
    };

    setAnimationDuration();

    function onResize() {
      assert(marquee != null, "No marquee element found");
      assert(parent != null, "No parent element found");
      marquee.innerHTML = "";
      let safety = 30;

      while (marquee.scrollHeight < parent.clientHeight * 2) {
        if (safety-- < 0) {
          console.warn("Safety limit reached, exiting loop");
          break;
        }

        marquee.innerHTML += innerItems;
        marquee.innerHTML += innerItems;
      }

      setAnimationDuration();
    }
    // Handle resize
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <></>;
}
