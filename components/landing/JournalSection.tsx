
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type JournalSectionProps = {
  posts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    cover: string;
    createdAt: Date;
  }>;
};

export default function JournalSection({ posts }: JournalSectionProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: 0.85,
      delay,
      ease: EASE,
    },
  });

  return (
    <section
      aria-labelledby="meh-journal-heading"
      className="relative isolate overflow-hidden bg-[#b8975a] text-[#171714]"
    >
      {/* Subtle architectural background details */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_5%,rgba(255,246,218,0.23),transparent_48%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-56 h-[700px] w-[700px] rounded-full border border-white/15"
      />

      <div className="relative mx-auto w-[90%] max-w-[1800px] py-20 sm:py-24 lg:py-32">
        {/* Section eyebrow */}
        <motion.div
          {...reveal()}
          className="mb-12 flex items-center justify-between gap-4 border-b border-[#171714]/20 pb-6 lg:mb-16"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#171714]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">
              The MEH Journal
            </span>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#171714]/60 sm:block">
            Insight & Perspective
          </span>
        </motion.div>

        {/* Heading and concise description */}
        <div className="grid items-end gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <motion.div {...reveal(0.05)}>
            <h2
              id="meh-journal-heading"
              className="max-w-[1100px] font-[family-name:var(--font-fraunces)] text-[clamp(3.2rem,7vw,8.5rem)] font-light leading-[0.99] tracking-[-0.06em]"
            >
              Know more.
              <span className="block italic text-[#fff4dc]">
                Decide better.
              </span>
            </h2>
          </motion.div>

          <motion.div
            {...reveal(0.12)}
            className="max-w-[440px] lg:pb-2"
          >
            <span className="mb-6 block h-px w-12 bg-[#171714]/60" />

            <p className="text-[15px] leading-[1.9] text-[#171714]/85 sm:text-[17px]">
              Practical insights to help you navigate
              property with confidence, ask the right
              questions, and avoid costly mistakes.
            </p>
          </motion.div>
        </div>

        {/* Entire image is a clickable link */}
        <motion.div
          {...reveal(0.15)}
          className="mt-14 sm:mt-18 lg:mt-24"
        >
          <Link
            href="/journal"
            aria-label="Explore the MEH Journal"
            className="group relative block overflow-hidden bg-[#34332f] outline-none focus-visible:ring-4 focus-visible:ring-[#fff4dc] focus-visible:ring-offset-4 focus-visible:ring-offset-[#b8975a]"
          >
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[21/9]">
              <Image
                src="/uploads/report/report1.webp"
                alt="Refined residential architecture featured in the MEH Journal"
                fill
                sizes="(max-width: 1024px) 100vw, 90vw"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055] group-focus-visible:scale-[1.055]"
              />

              {/* Cinematic overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#10110e]/85 via-[#10110e]/10 to-[#10110e]/15" />

              {/* Subtle hover tint */}
              <div className="pointer-events-none absolute inset-0 bg-[#b8975a]/0 transition-colors duration-700 group-hover:bg-[#b8975a]/10 group-focus-visible:bg-[#b8975a]/10" />

              {/* Top label */}
              <div className="absolute left-6 top-6 flex items-center gap-3 sm:left-10 sm:top-10">
                <span className="h-px w-8 bg-[#e2c68e]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/90">
                  Stories worth reading
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 p-6 sm:p-10 lg:p-14">
                <div className="max-w-[850px]">
                  <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em] text-[#e2c68e]">
                    Explore the Journal
                  </span>

                  <p className="font-[family-name:var(--font-fraunces)] text-[clamp(1.8rem,3.6vw,4.5rem)] font-light leading-[1.1] tracking-[-0.04em] text-white">
                    A little knowledge.
                    <br />
                    <span className="italic text-[#e9d5ad]">
                      A lasting difference.
                    </span>
                  </p>
                </div>

                {/* Clickable as part of the entire image */}
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/10 text-white backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:border-[#e2c68e] group-hover:bg-[#e2c68e] group-hover:text-[#171714] group-focus-visible:rotate-45 group-focus-visible:bg-[#e2c68e] group-focus-visible:text-[#171714] sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                  <ArrowUpRight
                    size={25}
                    strokeWidth={1.3}
                  />
                </span>
              </div>

              {/* Animated bottom border */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#e2c68e] transition-all duration-700 group-hover:w-full group-focus-visible:w-full"
              />
            </div>
          </Link>
        </motion.div>

        {/* Minimal closing link */}
        <motion.div
          {...reveal(0.1)}
          className="mt-8 flex items-center justify-between gap-4 sm:mt-10"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171714]/80">
            {posts.length} curated articles
          </span>

          <Link
            href="/journal"
            className="group inline-flex items-center gap-4 border-b border-[#171714]/60 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors hover:border-[#fff4dc] hover:text-[#fff4dc]"
          >
            Read the MEH Journal

            <ArrowUpRight
              size={17}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
