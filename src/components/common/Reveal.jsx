import React, { useEffect, useRef, useState } from 'react';

/**
 * Fades + lifts its children into view once, when scrolled near the viewport.
 * Hidden state lives behind a prefers-reduced-motion: no-preference media query
 * (in index.css), so reduced-motion users see content immediately, no JS gate needed.
 */
export default function Reveal({ children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${shown ? 'reveal--in' : ''}`}>
      {children}
    </div>
  );
}
