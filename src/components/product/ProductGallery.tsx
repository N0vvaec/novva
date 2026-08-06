"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [null];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-novva-white/10 bg-novva-white/5">
        {list[active] ? (
          <Image
            src={list[active]!}
            alt={`${name} — imagen ${active + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-novva-deeppurple/40 to-novva-black text-novva-purple">
            <span className="text-6xl font-extrabold tracking-widest">N</span>
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-3">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/5] w-20 overflow-hidden rounded-lg border transition-colors ${
                active === i
                  ? "border-novva-purple"
                  : "border-novva-white/10 opacity-60 hover:opacity-100"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              {img ? (
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center bg-novva-deeppurple/30 text-xl font-bold text-novva-purple">
                  N
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
