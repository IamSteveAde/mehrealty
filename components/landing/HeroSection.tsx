
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";

const SLIDE_DURATION = 8500;

const slides = [
  {
    label: "Philosophy",
    eyebrow: "THE MEH REALTY EXPERIENCE",
    first: "Beyond",
    second: "the ordinary.",
    description:
      "Extraordinary places. Thoughtful design. A more considered way to live.",
    cta: "Discover MEH Realty",
    href: "/about",
  },
  {
    label: "Developments",
    eyebrow: "PROPERTY DEVELOPMENT",
    first: "Built to",
    second: "inspire.",
    description:
      "Distinctive developments shaped by exceptional locations, thoughtful architecture and enduring quality.",
    cta: "Explore Developments",
    href: "/developments",
  },
  {
    label: "Investment",
    eyebrow: "REAL ESTATE INVESTMENT",
    first: "Invest in",
    second: "tomorrow.",
    description:
      "A considered approach to real estate opportunities, designed around long-term value.",
    cta: "Explore Investment",
    href: "/services",
  },
  {
    label: "Management",
    eyebrow: "PROPERTY MANAGEMENT",
    first: "Excellence",
    second: "in every detail.",
    description:
      "Thoughtful management that protects quality and enhances the experience of every property.",
    cta: "Our Expertise",
    href: "/services",
  },
  {
    label: "Hospitality",
    eyebrow: "HOSPITALITY & PARTNERSHIPS",
    first: "Made for",
    second: "living.",
    description:
      "Exceptional environments and meaningful experiences, brought together with intention.",
    cta: "Explore Our Services",
    href: "/services",
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const slide = slides[active];

  const selectSlide = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visible && !reducedMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (paused || reducedMotion || !visible) return;

    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      if (last) elapsedRef.current += now - last;
      last = now;

      if (elapsedRef.current >= SLIDE_DURATION) {
        elapsedRef.current = 0;
        setActive((current) => (current + 1) % slides.length);
      }

      setProgress(
        Math.min(
          (elapsedRef.current / SLIDE_DURATION) * 100,
          100
        )
      );

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, reducedMotion, visible]);

  return (
    <section
      ref={sectionRef}
      aria-label="MEH Realty introduction"
      aria-roledescription="carousel"
      className="relative isolate h-[100svh] max-h-[100vh] w-full overflow-hidden bg-[#11110f] text-white"
      onTouchStart={(event) => {
        touchStartRef.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartRef.current === null) return;

        const delta =
          event.changedTouches[0].clientX -
          touchStartRef.current;

        if (Math.abs(delta) > 70) {
          selectSlide(active + (delta < 0 ? 1 : -1));
        }

        touchStartRef.current = null;
      }}
    >
      {/* VIDEO BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/uploads/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/uploads/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* STRONG CINEMATIC OVERLAY */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,7,7,.88)_0%,rgba(5,7,7,.72)_38%,rgba(5,7,7,.40)_72%,rgba(5,7,7,.24)_100%)] max-md:bg-[linear-gradient(180deg,rgba(5,7,7,.55)_0%,rgba(5,7,7,.72)_55%,rgba(5,7,7,.88)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-transparent to-black/20"
      />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)_auto] px-6 pb-5 pt-[clamp(90px,13vh,145px)] sm:px-12 sm:pb-8 lg:px-[8%] lg:pb-10">
        {/* Small signature label */}
        <div className="meh-eyebrow-enter">
          <p className="text-[9px] font-medium uppercase tracking-[.32em] text-[#e4c796] sm:text-[10px]">
            
          </p>
        </div>

        {/* Main content */}
        <div className="flex min-h-0 flex-col justify-center py-3 sm:py-5">
          <div
            key={active}
            className="max-w-[1100px]"
            aria-live="polite"
          >
            {/* Eyebrow */}
            <p className="meh-eyebrow-enter mb-[clamp(8px,2vh,22px)] text-[9px] font-medium uppercase tracking-[.26em] text-white/75 sm:text-[10px]">
              {slide.eyebrow}
            </p>

            {/* Masked headline reveal */}
            <h1 className="font-[family-name:var(--font-fraunces)] font-light tracking-[-.055em]">
              <span className="block overflow-hidden">
                <span className="meh-headline-first block text-[clamp(2.8rem,8vw,8rem)] leading-[.95]">
                  {slide.first}
                </span>
              </span>

              <span className="block overflow-hidden">
                <span className="meh-headline-second block text-[clamp(2.6rem,7.5vw,7.6rem)] font-light italic leading-[1.03] text-[#e5cca5]">
                  {slide.second}
                </span>
              </span>
            </h1>

            {/* Description and CTA */}
            <div className="mt-[clamp(16px,3.2vh,38px)] flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <p className="meh-description-enter max-w-[430px] text-[clamp(12px,1.2vw,16px)] font-light leading-[1.7] text-white/85">
                {slide.description}
              </p>

              {/* PREMIUM GOLD CTA */}
              <Link
                href={slide.href}
                className="meh-cta-enter group relative inline-flex min-h-[52px] shrink-0 items-center justify-between gap-7 overflow-hidden bg-[#c5a36c] px-6 py-4 text-[10px] font-semibold uppercase tracking-[.18em] text-[#15130e] shadow-[0_12px_36px_rgba(0,0,0,.18)] transition-all duration-500 hover:bg-[#e4c99b] hover:shadow-[0_18px_45px_rgba(0,0,0,.25)] sm:min-h-[58px] sm:px-7"
              >
                <span className="relative z-10">{slide.cta}</span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.5}
                  className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                />

                <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 ease-out group-hover:translate-x-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* SLIDER FOOTER */}
        <div className="flex items-center gap-5 border-t border-white/20 pt-4 sm:gap-8 sm:pt-5">
          <div className="grid min-w-0 flex-1 grid-cols-5 gap-2 sm:gap-4">
            {slides.map((item, index) => {
              const selected = active === index;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => selectSlide(index)}
                  aria-label={`Show ${item.label}`}
                  aria-current={selected ? "true" : undefined}
                  className="group min-w-0 text-left"
                >
                  <span className="mb-2 block h-[2px] w-full overflow-hidden bg-white/20">
                    <span
                      className="block h-full bg-[#d8b980]"
                      style={{
                        width: selected
                          ? reducedMotion
                            ? "100%"
                            : `${progress}%`
                          : "0%",
                      }}
                    />
                  </span>

                  <span
                    className={`block truncate text-[9px] uppercase tracking-[.1em] transition-colors duration-500 sm:text-[10px] ${
                      selected
                        ? "text-white"
                        : "text-white/45 group-hover:text-white/80"
                    }`}
                  >
                    <span className="sm:hidden">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="hidden sm:inline">
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-[#e5cca5]"
            >
              {paused ? (
                <Play size={14} fill="currentColor" />
              ) : (
                <Pause size={14} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={() => selectSlide(active + 1)}
              aria-label="Next slide"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-500 hover:border-[#d8b980] hover:bg-[#d8b980] hover:text-[#151512]"
            >
              <ArrowRight
                size={17}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* LUXURY REVEAL ANIMATIONS */}
      <style jsx>{`
        .meh-eyebrow-enter {
          animation: meh-fade-down 1.1s ease-out both;
        }

        .meh-headline-first {
          animation: meh-mask-reveal 1.3s
            cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        .meh-headline-second {
          animation: meh-mask-reveal 1.45s
            cubic-bezier(0.22, 1, 0.36, 1) 0.28s both;
        }

        .meh-description-enter {
          animation: meh-fade-up 1.1s
            cubic-bezier(0.22, 1, 0.36, 1) 0.65s both;
        }

        .meh-cta-enter {
          animation: meh-fade-up 1.1s
            cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
        }

        @keyframes meh-mask-reveal {
          from {
            opacity: 0;
            transform: translateY(110%) skewY(3deg);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0) skewY(0);
            filter: blur(0);
          }
        }

        @keyframes meh-fade-down {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes meh-fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .meh-eyebrow-enter,
          .meh-headline-first,
          .meh-headline-second,
          .meh-description-enter,
          .meh-cta-enter {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
