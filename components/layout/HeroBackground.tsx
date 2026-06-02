"use client";
import { useState, useEffect } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1608748010899-18f300247112?fm=jpg&q=60&w=3000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228578-6b39aba552d5?fm=jpg&q=60&w=3000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=75&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=75&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=75&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=75&fit=crop",
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1400&q=75&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=75&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=75&fit=crop",
];

export default function HeroBackground() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((i) => (i + 1) % IMAGES.length),
      120_000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[5ms] ${
            i === current ? "opacity-25" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
