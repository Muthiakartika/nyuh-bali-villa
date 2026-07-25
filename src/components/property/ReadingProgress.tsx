"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline gold bar that fills as the article is read, pinned directly under
 * the sticky header.
 *
 * **Purely decorative and it must stay that way.** It carries no content, is
 * hidden from assistive technology, and starts at zero width — if the effect
 * never runs, a visitor loses a progress bar, not information. That is the same
 * standard `Reveal` is held to: presentation may fail, content may not.
 *
 * The width is written straight to the node's style rather than through React
 * state. A scroll handler that calls `setState` re-renders on every frame of
 * every scroll, which is exactly the kind of work that makes a long article
 * feel heavy — the one thing a reading aid must not do.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    // Someone who asked their OS to reduce motion should not get a bar
    // animating along the top of the page.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      // How far the *document* can scroll, not how tall it is.
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
    };

    // Coalesce to one write per frame — scroll fires far more often than paint.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // `top-[68px]` / `lg:top-[72px]` is the header's own height — the bar sits
    // on the header's lower edge, replacing its gold hairline as you read.
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[68px] z-[140] h-px lg:top-[72px]"
    >
      <div ref={ref} className="h-px w-0 bg-primary transition-[width] duration-150 ease-out" />
    </div>
  );
}
