
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ImageIcon,
} from "lucide-react";

export const journeyRoutes = [
  {
    n: "01",
    title: "Acquire a residence",
    text: "Explore a considered collection of exceptional homes.",
    href: "/developments",
    image: "/uploads/residence.png",
    imageLabel: "The art of belonging",
  },
  {
    n: "02",
    title: "Explore investments",
    text: "Discover opportunities shaped around long-term value.",
    href: "/services#investment",
    image: "/uploads/investment.png",
    imageLabel: "A considered future",
  },
  {
    n: "03",
    title: "Property management",
    text: "A thoughtful approach to the care of your property.",
    href: "/services#management",
    image: "/uploads/manage.png",
    imageLabel: "Care in every detail",
  },
  {
    n: "04",
    title: "Hospitality & partnerships",
    text: "Explore our expertise and strategic collaborations.",
    href: "/services#hospitality",
    image: "/uploads/hospitality.png",
    imageLabel: "Beyond the expected",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

type JourneyRoute = (typeof journeyRoutes)[number];

function JourneyArtwork({
  route,
  sizes,
}: {
  route: JourneyRoute;
  sizes: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="relative h-full w-full">
      {imageFailed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/40">
          <ImageIcon
            size={28}
            strokeWidth={1}
            className="text-[#b8975a]"
          />
          <span className="text-center font-[family-name:var(--font-fraunces)] text-xl font-light italic">
            {route.imageLabel}
          </span>
        </div>
      ) : (
        <Image
          src={route.image}
          alt={`${route.title} — ${route.imageLabel}`}
          fill
          sizes={sizes}
          className="object-contain"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}

function ChangingArtwork({
  route,
  reducedMotion,
  sizes,
}: {
  route: JourneyRoute;
  reducedMotion: boolean;
  sizes: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={route.n}
        initial={
          reducedMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                y: 16,
                scale: 0.97,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: reducedMotion ? 0 : -8,
        }}
        transition={{
          duration: reducedMotion ? 0.1 : 0.55,
          ease: EASE,
        }}
        className="absolute inset-0"
      >
        <JourneyArtwork route={route} sizes={sizes} />
      </motion.div>
    </AnimatePresence>
  );
}

export default function JourneySection() {
  const reducedMotion = Boolean(useReducedMotion());

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const activeRoute = journeyRoutes[activeIndex];

  return (
    <section
      aria-labelledby="journey-heading"
      className="relative isolate overflow-hidden bg-[#10110e] py-20 text-[#f7f5ee] sm:py-28 lg:py-36"
    >
      <div className="relative mx-auto max-w-[1540px] px-6 sm:px-10 lg:px-[7%]">
        {/* INTRODUCTION */}
        <header className="max-w-[760px]">
          <motion.div
            initial={
              reducedMotion ? false : { opacity: 0, y: 12 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-4"
          >
            <span className="h-px w-9 bg-[#b8975a]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#c9ad7d]">
              Your journey begins here
            </p>
          </motion.div>

          <motion.h2
            id="journey-heading"
            initial={
              reducedMotion ? false : { opacity: 0, y: 18 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.85,
              ease: EASE,
            }}
            className="mt-9 font-[family-name:var(--font-fraunces)] text-[clamp(2.4rem,4.5vw,4.9rem)] font-light leading-[1.15] tracking-[-0.045em] sm:mt-12"
          >
            What brings you{" "}
            <span className="italic text-[#c5a36c]">
              to MEH?
            </span>
          </motion.h2>

          <motion.p
            initial={
              reducedMotion ? false : { opacity: 0, y: 12 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: EASE,
            }}
            className="mt-7 max-w-[510px] text-[13px] leading-[1.95] text-white/50 sm:mt-9 sm:text-[15px]"
          >
            Every ambition begins somewhere. Whether
            you&apos;re looking for a home, an investment,
            or a trusted partner, your journey starts here.
          </motion.p>
        </header>

        {/* NAVIGATION + VISUAL */}
        <div className="mt-16 grid gap-12 sm:mt-20 lg:mt-28 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:items-center lg:gap-[9%]">
          {/* NAVIGATION */}
          <nav
            aria-label="Explore MEH Realty"
            className="min-w-0 border-t border-white/[0.14]"
            onMouseLeave={() => setIsInteracting(false)}
          >
            {journeyRoutes.map((route, index) => {
              const active = activeIndex === index;
              const hovered = isInteracting && active;

              return (
                <motion.div
                  key={route.n}
                  initial={
                    reducedMotion
                      ? false
                      : { opacity: 0, y: 15 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.06,
                    ease: EASE,
                  }}
                  className="relative border-b border-white/[0.14]"
                  onMouseEnter={() => {
                    setActiveIndex(index);
                    setIsInteracting(true);
                  }}
                >
                  <div className="flex items-start gap-4 py-8 sm:gap-7 sm:py-11 lg:min-h-[185px]">
                    {/* SELECT ROUTE / PREVIEW IMAGE */}
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      aria-pressed={active}
                      aria-label={`Preview ${route.title}`}
                      className="group flex min-w-0 flex-1 items-start gap-4 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#c5a36c] sm:gap-7"
                    >
                      <span className="mt-2 w-6 shrink-0 text-[10px] tracking-[0.12em] text-[#c5a36c] sm:w-7">
                        {route.n}
                      </span>

                      <div className="min-w-0 flex-1">
                        <motion.h3
                          initial={false}
                          animate={{
                            x:
                              hovered && !reducedMotion
                                ? 5
                                : 0,
                          }}
                          transition={{
                            duration: 0.45,
                            ease: EASE,
                          }}
                          className={`font-[family-name:var(--font-fraunces)] text-[clamp(1.55rem,2.5vw,3rem)] font-light leading-[1.2] tracking-[-0.035em] transition-colors duration-500 ${
                            active
                              ? "text-[#d9bc8b]"
                              : "text-[#f7f5ee] group-hover:text-[#d9bc8b]"
                          }`}
                        >
                          {route.title}
                        </motion.h3>

                        <p className="mt-4 max-w-[380px] text-[12px] leading-[1.85] text-white/45 sm:text-[13px]">
                          {route.text}
                        </p>
                      </div>
                    </button>

                    {/* NAVIGATION LINK */}
                    <Link
                      href={route.href}
                      aria-label={`Explore ${route.title}`}
                      onFocus={() => setActiveIndex(index)}
                      className="group mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#c5a36c] transition-all duration-300 hover:border-[#c5a36c] hover:bg-[#c5a36c] hover:text-[#10110e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c5a36c]"
                    >
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.3}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>

                  {/* ACTIVE LINE */}
                  <motion.div
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      scaleX: active ? 1 : 0,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.55,
                      ease: EASE,
                    }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[#b8975a]"
                  />
                </motion.div>
              );
            })}
          </nav>

          {/* DESKTOP: IMAGE ON RIGHT */}
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 24 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.9,
              ease: EASE,
            }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] w-full max-h-[700px]">
              <ChangingArtwork
                route={activeRoute}
                reducedMotion={reducedMotion}
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                {activeRoute.imageLabel}
              </span>

              <span className="text-[10px] tracking-[0.16em] text-[#c5a36c]">
                {activeRoute.n} / 04
              </span>
            </div>
          </motion.div>
        </div>

        {/* MOBILE / TABLET: ONE IMAGE BELOW ALL ROUTES */}
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 18 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.8,
            ease: EASE,
          }}
          className="mt-10 lg:hidden"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
            <ChangingArtwork
              route={activeRoute}
              reducedMotion={reducedMotion}
              sizes="(min-width: 640px) 520px, 100vw"
            />
          </div>

          <div className="mx-auto mt-5 flex max-w-[520px] items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">
              {activeRoute.imageLabel}
            </span>

            <span className="text-[10px] tracking-[0.14em] text-[#c5a36c]">
              {activeRoute.n} / 04
            </span>
          </div>

          <Link
            href={activeRoute.href}
            className="group mx-auto mt-7 flex max-w-[520px] items-center justify-between border-t border-white/10 pt-5 text-[11px] tracking-[0.04em] text-[#c5a36c] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c5a36c]"
          >
            <span>Explore {activeRoute.title}</span>

            <ArrowUpRight
              size={18}
              strokeWidth={1.2}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* SECTION FOOTER */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.12] pt-8 sm:mt-28 lg:mt-36">
          <p className="text-[11px] leading-relaxed text-white/35">
            Thoughtfully considered. Distinctly MEH.
          </p>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 text-[11px] tracking-[0.04em] text-[#c5a36c] transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c5a36c]"
          >
            Speak with our team

            <ArrowRight
              size={17}
              strokeWidth={1.3}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
