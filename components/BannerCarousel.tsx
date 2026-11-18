"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";
import type { Banner } from "@/types";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [paused, banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className={`relative overflow-hidden bg-gradient-to-r ${banner.gradient}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex h-64 max-w-7xl flex-col justify-center px-8 text-white md:h-80 md:px-16">
        <p className="text-sm font-semibold uppercase tracking-widest">Green Go presents</p>
        <h2 className="mt-2 text-3xl font-extrabold md:text-5xl">{banner.title}</h2>
        <p className="mt-2 text-lg">{banner.subtitle}</p>
        <Link
          href={banner.href}
          className="mt-6 w-fit rounded bg-white px-6 py-3 text-sm font-bold uppercase text-ink hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          {banner.cta}
        </Link>
      </div>
      <button
        type="button"
        aria-label="Previous banner"
        onClick={() => setIndex((index - 1 + banners.length) % banners.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
      >
        <ChevronLeftIcon className="h-5 w-5 text-ink" />
      </button>
      <button
        type="button"
        aria-label="Next banner"
        onClick={() => setIndex((index + 1) % banners.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
      >
        <ChevronRightIcon className="h-5 w-5 text-ink" />
      </button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((item, position) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to banner ${position + 1}`}
            aria-current={position === index}
            onClick={() => setIndex(position)}
            className={`h-2.5 w-2.5 rounded-full ${position === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
