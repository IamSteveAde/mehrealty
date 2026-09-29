
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CTASection() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-[#faf9f6] text-[#171714]"
    >
      {/* AMBIENT GOLD GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[38%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b8975a]/[0.07] blur-[110px] sm:h-[950px] sm:w-[950px]" />

        <div className="absolute -right-[15%] -top-[40%] h-[700px] w-[700px] rounded-full border border-[#b8975a]/10" />

        <div className="absolute -right-[10%] -top-[30%] h-[580px] w-[580px] rounded-full border border-[#b8975a]/10" />

        <div className="absolute -left-[18%] bottom-[-65%] h-[650px] w-[650px] rounded-full border border-[#b8975a]/10" />
      </div>

      {/* TOP EDITORIAL RULE */}
      <div className="relative mx-auto w-[90%] max-w-[1800px]">
        <div className="flex items-center justify-between gap-4 border-b border-[#171714]/10 py-7">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#b8975a]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.23em] text-[#9c7b46]">
              An invitation from MEH
            </span>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#171714]/35 sm:block">
            A conversation worth having
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative mx-auto flex w-[90%] max-w-[1800px] flex-col items-center px-1 pb-24 pt-20 text-center sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36">
        {/* SMALL GOLD EMBLEM */}


        {/* MAIN HEADING */}
        <motion.h2
          id="cta-heading"
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 30 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.08,
            ease: EASE,
          }}
          className="mt-9 max-w-[1300px] font-[family-name:var(--font-fraunces)] text-[clamp(1.3rem,4.2vw,5rem)] font-light leading-[0.99] tracking-[-0.065em] sm:mt-11"
        >
          Every great place
          <span className="block">
            begins with
          </span>
          <span className="block italic text-[#b8975a]">
            a conversation.
          </span>
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 18 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.85,
            delay: 0.16,
            ease: EASE,
          }}
          className="mx-auto mt-10 max-w-[620px] text-[14px] leading-[2] text-[#171714]/55 sm:mt-12 sm:text-[16px]"
        >
          Perhaps you have a vision for your next home.
          An investment you&apos;re considering.
          Or simply a question worth asking.
          Whatever brings you here, we&apos;d be delighted
          to hear your story and explore what&apos;s possible
          together.
        </motion.p>

        {/* CONSULTATION BUTTON */}
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 18 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.85,
            delay: 0.24,
            ease: EASE,
          }}
          className="mt-12 sm:mt-14"
        >
          <Link
            href="/contact"
            className="group relative inline-flex min-h-[64px] items-center justify-between gap-12 overflow-hidden rounded-full border border-[#171714] bg-[#171714] px-8 py-4 text-white transition-all duration-500 hover:border-[#b8975a] hover:shadow-[0_20px_55px_-20px_rgba(184,151,90,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8975a] sm:min-h-[74px] sm:gap-20 sm:px-10"
          >
            {/* GOLD HOVER FILL */}
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-[#b8975a] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />

            <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.18em] sm:text-[11px]">
              Arrange a consultation
            </span>

            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:border-white/70">
              <ArrowUpRight
                size={18}
                strokeWidth={1.4}
              />
            </span>
          </Link>
        </motion.div>

        {/* SUBTLE FOOTNOTE */}
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: 0 }
          }
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.4,
          }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <span className="h-1 w-1 rounded-full bg-[#b8975a]" />

          <span className="text-[10px] uppercase tracking-[0.18em] text-[#171714]/40">
            Thoughtful conversations. Meaningful possibilities.
          </span>

          <span className="h-1 w-1 rounded-full bg-[#b8975a]" />
        </motion.div>
      </div>

      {/* BOTTOM EDITORIAL STRIP */}
      <div className="relative border-t border-[#171714]/10">
        <div className="mx-auto flex w-[90%] max-w-[1800px] flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="font-[family-name:var(--font-fraunces)] text-[19px] font-light italic text-[#b8975a]">
              MEH Realty
            </span>

            <span className="h-4 w-px bg-[#171714]/15" />

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#171714]/40">
              Beyond the expected
            </span>
          </div>

          <Link
            href="/about"
            className="group inline-flex w-fit items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-[#171714]/55 transition-colors hover:text-[#b8975a]"
          >
            Get to know us

            <ArrowRight
              size={15}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
