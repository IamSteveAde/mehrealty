
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Mail,
  MoveUpRight,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const navigation = [
  { label: "Home", href: "/" },
  { label: "Developments", href: "/developments" },
  { label: "Our Expertise", href: "/services" },
  { label: "The Journal", href: "/journal" },
  { label: "Media Gallery", href: "/media" },
  { label: "Our Story", href: "/about" },
];

const expertise = [
  { label: "Property Development", href: "/services" },
  { label: "Investment Advisory", href: "/services#investment" },
  { label: "Property Management", href: "/services#management" },
  { label: "Hospitality & Partnerships", href: "/services#hospitality" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group/link inline-flex w-fit items-center gap-3 text-[13px] text-white/50 transition-colors duration-300 hover:text-[#e3c58f] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8975a] sm:text-[14px]"
    >
      <span className="relative">
        {children}

        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#b8975a] transition-all duration-500 group-hover/link:w-full" />
      </span>

      <ArrowUpRight
        size={13}
        strokeWidth={1.4}
        className="-translate-x-1 translate-y-1 text-[#b8975a] opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
      />
    </Link>
  );
}

function FooterHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="h-px w-5 bg-[#b8975a]" />

      <h3 className="text-[10px] font-medium uppercase tracking-[0.23em] text-[#c5a36c]">
        {children}
      </h3>
    </div>
  );
}

export default function Footer() {
  const reducedMotion = Boolean(useReducedMotion());

  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#141512] text-white">
      {/* BACKGROUND ATMOSPHERE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-[20%] -top-[20%] h-[850px] w-[850px] rounded-full bg-[#b8975a]/[0.045] blur-[130px]" />

        <div className="absolute -left-[25%] bottom-[-35%] h-[750px] w-[750px] rounded-full bg-[#b8975a]/[0.035] blur-[130px]" />

        <div className="absolute right-[8%] top-[15%] h-[550px] w-[550px] rounded-full border border-white/[0.035]" />

        <div className="absolute right-[11%] top-[19%] h-[450px] w-[450px] rounded-full border border-white/[0.025]" />
      </div>

      {/* TOP BRAND STRIP */}
      <div className="relative border-b border-white/[0.09]">
        <div className="mx-auto flex w-[90%] max-w-[1800px] flex-wrap items-center justify-between gap-5 py-7">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-[#b8975a]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#c5a36c]">
              MEH Realty
            </span>
          </div>

          <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
            Thoughtfully conceived. Exceptionally lived.
          </span>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="relative mx-auto w-[90%] max-w-[1800px] pb-20 pt-20 sm:pb-24 sm:pt-24 lg:pb-32 lg:pt-28">
        {/* LOGO AND BRAND INTRODUCTION */}
        <div className="grid gap-12 border-b border-white/[0.1] pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24 lg:pb-24">
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 25 }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              ease: EASE,
            }}
          >
            {/* ACTUAL BRAND LOGO */}
            <Link
              href="/"
              aria-label="MEH Realty — Home"
              className="group/logo inline-block focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-[#b8975a]"
            >
              <div className="relative h-[85px] w-[220px] sm:h-[110px] sm:w-[290px] lg:h-[130px] lg:w-[340px]">
                <Image
                  src="/uploads/logo.png"
                  alt="MEH Realty logo"
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 1024px) 290px, 340px"
                  className="object-contain object-left transition-opacity duration-500 group-hover/logo:opacity-80"
                />
              </div>
            </Link>

            <p className="mt-9 max-w-[480px] font-[family-name:var(--font-fraunces)] text-[clamp(1.6rem,2.5vw,2.8rem)] font-light leading-[1.4] tracking-[-0.025em] text-[#f1eee8]">
              Creating places that mean more.
              <span className="italic text-[#c5a36c]">
                {" "}For the lives lived within them.
              </span>
            </p>
          </motion.div>

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
              delay: 0.1,
              ease: EASE,
            }}
            className="max-w-[480px] lg:ml-auto"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#b8975a]" />

              <span className="text-[10px] uppercase tracking-[0.22em] text-[#c5a36c]">
                A considered approach
              </span>
            </div>

            <p className="text-[14px] leading-[2] text-white/50 sm:text-[15px]">
              At MEH Realty, we believe exceptional property
              is about more than architecture. It is about
              understanding people, creating meaningful
              spaces, and building enduring value.
            </p>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-4 border-b border-[#b8975a]/60 pb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80 transition-colors duration-300 hover:text-[#e3c58f]"
            >
              Discover our story

              <ArrowUpRight
                size={17}
                strokeWidth={1.3}
                className="text-[#b8975a] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* FOOTER NAVIGATION */}
        <div className="grid gap-14 border-b border-white/[0.1] py-20 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-[1fr_1.2fr_1.1fr] lg:gap-20 lg:py-24">
          {/* EXPLORE */}
          <div>
            <FooterHeading>Explore</FooterHeading>

            <nav
              aria-label="Footer navigation"
              className="flex flex-col items-start gap-5"
            >
              {navigation.map((item) => (
                <FooterLink
                  key={item.href}
                  href={item.href}
                >
                  {item.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* OUR EXPERTISE */}
          <div>
            <FooterHeading>Our Expertise</FooterHeading>

            <nav
              aria-label="Our expertise"
              className="flex flex-col items-start gap-5"
            >
              {expertise.map((item) => (
                <FooterLink
                  key={item.label}
                  href={item.href}
                >
                  {item.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterHeading>Begin a Conversation</FooterHeading>

            <p className="max-w-[340px] font-[family-name:var(--font-fraunces)] text-[clamp(1.5rem,2.2vw,2.35rem)] font-light leading-[1.3] tracking-[-0.025em]">
              Have something
              <span className="italic text-[#c5a36c]">
                {" "}in mind?
              </span>
            </p>

            <p className="mt-5 max-w-[310px] text-[13px] leading-[1.9] text-white/45">
              We would be delighted to hear what
              you are looking for and explore how
              we can help.
            </p>

            <Link
              href="/contact"
              className="group mt-8 inline-flex min-h-[56px] items-center justify-between gap-10 rounded-full border border-[#b8975a]/60 px-6 text-[10px] font-medium uppercase tracking-[0.15em] text-[#e3c58f] transition-all duration-500 hover:border-[#b8975a] hover:bg-[#b8975a] hover:text-[#141512] hover:shadow-[0_0_35px_rgba(184,151,90,0.15)]"
            >
              Make an enquiry

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current/40 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.3}
                />
              </span>
            </Link>
          </div>
        </div>

        {/* CONTACT DETAILS */}
        <div className="grid gap-10 border-b border-white/[0.1] py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 lg:py-16">
          {/* LOCATION */}
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b8975a]/25 text-[#b8975a]">
              <MapPin
                size={18}
                strokeWidth={1.2}
              />
            </span>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.19em] text-[#c5a36c]">
                Our Location
              </p>

              <p className="text-[13px] leading-[1.8] text-white/55">
                Ikoyi, Lagos
                <br />
                Nigeria
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b8975a]/25 text-[#b8975a]">
              <Mail
                size={18}
                strokeWidth={1.2}
              />
            </span>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.19em] text-[#c5a36c]">
                Email Us
              </p>

              <a
                href="mailto:contactus@meh.ae"
                className="text-[13px] leading-[1.8] text-white/55 transition-colors duration-300 hover:text-[#e3c58f]"
              >
                contactus@meh.ae
              </a>
            </div>
          </div>

          {/* PHILOSOPHY */}
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b8975a]/25 text-[#b8975a]">
              <MoveUpRight
                size={18}
                strokeWidth={1.2}
              />
            </span>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.19em] text-[#c5a36c]">
                Our Philosophy
              </p>

              <p className="max-w-[230px] text-[13px] leading-[1.8] text-white/55">
                Beyond property.
                <br />
                Towards possibility.
              </p>
            </div>
          </div>
        </div>

        {/* LARGE EDITORIAL BRAND STATEMENT */}
        <div className="relative overflow-hidden border-b border-white/[0.1] py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="mb-7 block text-[10px] uppercase tracking-[0.23em] text-[#b8975a]">
                The MEH Perspective
              </span>

              <motion.p
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 22 }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.95,
                  ease: EASE,
                }}
                className="max-w-[1150px] font-[family-name:var(--font-fraunces)] text-[clamp(2.6rem,5.5vw,7rem)] font-light leading-[1.08] tracking-[-0.055em] text-white"
              >
                More than a place.
                <span className="block italic text-[#b8975a]">
                  A way of living.
                </span>
              </motion.p>
            </div>

            <Link
              href="/"
              aria-label="Return to homepage"
              className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 hover:-translate-y-1 hover:border-[#b8975a] hover:bg-[#b8975a] hover:text-[#141512] sm:h-16 sm:w-16"
            >
              <ArrowUpRight
                size={23}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:rotate-[-45deg]"
              />
            </Link>
          </div>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="flex flex-col gap-7 pt-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/35">
              © {year} MEH Realty Limited
            </span>

            <span className="hidden h-3 w-px bg-white/15 sm:block" />

            <span className="text-[10px] uppercase tracking-[0.15em] text-white/25">
              All rights reserved
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              href="/privacy"
              className="text-[10px] uppercase tracking-[0.15em] text-white/35 transition-colors hover:text-[#c5a36c]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-[10px] uppercase tracking-[0.15em] text-white/35 transition-colors hover:text-[#c5a36c]"
            >
              Terms of Use
            </Link>

            <span className="hidden h-3 w-px bg-white/15 sm:block" />

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#b8975a]/65">
              Built around distinction
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
