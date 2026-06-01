"use client";
import { useState } from "react";
import Image from "next/image";

const categoryBg: Record<string, string> = {
  tote: "bg-[#F5EDE8]", handbag: "bg-[#EDE5EC]",
  clutch: "bg-[#F0E8EC]", jewellery: "bg-[#EDE8F0]", headbands: "bg-[#E8F0EC]",
  lipgloss: "bg-[#F5E8EC]",
};
const categoryEmoji: Record<string, string> = {
  tote: "👜", handbag: "👛", clutch: "💼", jewellery: "💍", headbands: "🎀",
  lipgloss: "💄",
};

interface Props {
  images: string[];
  name: string;
  category: string;
  badge?: string | null;
  discount?: number | null;
}

export default function ProductImageGallery({ images, name, category, badge, discount }: Props) {
  const [active, setActive] = useState(0);

  if (!images[0]) {
    return (
      <div className={`rounded-3xl flex items-center justify-center text-8xl h-[400px] md:h-[500px] relative ${categoryBg[category] || "bg-cream"}`}>
        <span>{categoryEmoji[category]}</span>
        {badge && (
          <span className={`absolute top-5 left-5 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full font-medium ${
            badge === "new" ? "bg-plum text-blush" : badge === "sale" ? "bg-taupe text-white" : "bg-mauve text-blush"
          }`}>
            {badge === "sale" && discount ? `−${discount}%` : badge}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className={`relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] ${categoryBg[category] || "bg-cream"}`}>
        <Image
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {badge && (
          <span className={`absolute top-5 left-5 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full font-medium ${
            badge === "new" ? "bg-plum text-blush" : badge === "sale" ? "bg-taupe text-white" : "bg-mauve text-blush"
          }`}>
            {badge === "sale" && discount ? `−${discount}%` : badge}
          </span>
        )}
      </div>

      {/* Thumbnails — only shown when there are multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                active === i ? "border-plum" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
