import React, { useState, useEffect, useRef } from 'react';
import { PiArrowUpBold } from 'react-icons/pi';
import './ScrollToTopButton.css';

// Visibility comes from a sentinel crossing the viewport top, not from a
// scroll listener comparing window.scrollY on every frame.
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const sentinel = useRef(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // isIntersecting alone is not enough: the sentinel is also outside the
    // viewport before you have scrolled to it, which showed the button at the
    // very top of the page. boundingClientRect.top < 0 means it is above the
    // viewport, i.e. actually scrolled past.
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });

  return (
    <>
      <span ref={sentinel} className="scroll-to-top__sentinel" aria-hidden="true" />
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`scroll-to-top ${visible ? 'scroll-to-top--visible' : ''}`}
        tabIndex={visible ? 0 : -1}
      >
        <PiArrowUpBold size={18} />
      </button>
    </>
  );
};

export default ScrollToTopButton;
