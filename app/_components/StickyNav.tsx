"use client";

import { useEffect, useState } from "react";

export default function StickyNav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    function onScroll() {
      setStuck(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        stuck
          ? "fixed top-0 left-0 right-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur transition"
          : "relative border-b border-stone-100 bg-white transition"
      }
    >
      <div className="container-cp flex items-center justify-between py-4">
        <a
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-stone-900"
        >
          CleanerPay
        </a>
        <nav className="flex items-center gap-6 text-sm">
          <a
            href="#products"
            className="hidden sm:inline text-stone-600 hover:text-stone-900"
          >
            Products
          </a>
          <a
            href="#how"
            className="hidden sm:inline text-stone-600 hover:text-stone-900"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="hidden sm:inline text-stone-600 hover:text-stone-900"
          >
            Pricing
          </a>
          <a
            href="#signup"
            className="inline-flex items-center rounded-md bg-teal px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-dark transition"
          >
            Get started
          </a>
        </nav>
      </div>
    </header>
  );
}
