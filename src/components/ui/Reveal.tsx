"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Extra classes for the wrapper (it's a plain block element otherwise). */
  className?: string;
  /**
   * Milliseconds to hold before this element animates in. Used to stagger a
   * row of cards so they arrive one after another rather than all at once.
   * Applied as an inline `transitionDelay` rather than a Tailwind class so
   * callers can pass any number without a matching arbitrary class needing to
   * exist in the stylesheet.
   */
  delay?: number;
};

/**
 * Fades and lifts its children into place the first time they scroll into
 * view — the main thing that separates the site from a modern one, since
 * everything previously appeared at full opacity with no sense of motion.
 *
 * **The important detail is what happens when this doesn't work.** The
 * obvious implementation renders at `opacity: 0` and lets JavaScript reveal
 * it, which means any failure — JS disabled, a bundle error, an
 * `IntersectionObserver` that never fires — leaves the visitor staring at a
 * blank page, and search engines indexing invisible content. So the markup
 * ships *visible* and this component only ever takes visibility away, after
 * it has confirmed on the client that it can give it back:
 *
 *  1. Server-rendered HTML has no hidden state at all.
 *  2. On mount, if the element is still below the fold, it gets hidden.
 *  3. The observer then reveals it as it scrolls in.
 *
 * Anything above the fold at load is simply left alone, which also avoids a
 * flash of content appearing and then hiding itself.
 *
 * Visibility is toggled by adding/removing a class on the node directly
 * rather than through React state: this is purely presentational, it must not
 * trigger a re-render of the wrapped content, and it keeps the effect free of
 * the `setState`-inside-an-effect pattern React's lint rules flag.
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    // Already on screen? Leave it be — no hide, no animation, no flash.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;

    element.classList.add("reveal-hidden");

    // A working IntersectionObserver always delivers one initial callback per
    // observed target — including for targets that are off screen, where it
    // reports `isIntersecting: false`. So "no callback whatsoever" is a
    // reliable signal that observation is not functioning (a headless or
    // background tab that never paints will do this), and the only correct
    // response is to give the content back rather than leave it invisible.
    let observerResponded = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        observerResponded = true;
        if (entry.isIntersecting) {
          element.classList.remove("reveal-hidden");
          observer.disconnect();
        }
      },
      // The negative bottom margin means an element has to be a little way
      // into the viewport before it animates, rather than firing while it's
      // still clipped by the bottom edge.
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    const failSafe = window.setTimeout(() => {
      if (!observerResponded) {
        element.classList.remove("reveal-hidden");
        observer.disconnect();
      }
    }, 1500);

    return () => {
      window.clearTimeout(failSafe);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
