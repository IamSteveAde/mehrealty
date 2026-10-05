
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const navigation = [
  { label: "Developments", href: "/developments" },
  { label: "Our Expertise", href: "/services" },
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Media", href: "/media" },
];

const ease = [0.76, 0, 0.24, 1] as const;
const revealEase = [0.22, 1, 0.36, 1] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reducedMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previouslyOpened = useRef(false);

  useEffect(() => {
    const updateScroll = () => {
      setScrolled(window.scrollY > 36);
    };

    updateScroll();

    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    previouslyOpened.current = true;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && previouslyOpened.current) {
      triggerRef.current?.focus();
      previouslyOpened.current = false;
    }
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      if (media.matches) setMenuOpen(false);
    };

    media.addEventListener("change", handleResize);

    return () => {
      media.removeEventListener("change", handleResize);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(`${href}/`);

  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      {/* FIXED HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-[120] w-full text-white transition-[background-color,box-shadow] duration-700 ${
          transparent
            ? "bg-transparent"
            : "bg-[#111310]/95 shadow-[0_12px_50px_rgba(0,0,0,.18)] backdrop-blur-2xl"
        }`}
      >
        <div className={isHome
          ? "mx-auto grid h-[70px] w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-10 lg:px-[9%]"
          : "mx-auto flex h-[76px] w-full max-w-[1800px] items-center justify-between gap-5 px-6 sm:h-[88px] sm:px-10 lg:h-[96px] lg:px-[5%]"}>
          {/* LOGO */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-label="MEH Realty — Home"
            className={`relative z-[125] flex shrink-0 items-center ${isHome ? "order-2 justify-self-center" : ""}`}
          >
            <Image
              src="/uploads/logo.png"
              alt="MEH Realty"
              width={240}
              height={90}
              priority
              className={isHome
                ? "h-auto w-[110px] object-contain lg:w-[140px]"
                : "h-auto w-[155px] object-contain transition-transform duration-700 hover:scale-[1.035] sm:w-[175px] lg:w-[195px]"}
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className={`hidden items-center gap-[clamp(18px,2.3vw,42px)] lg:flex ${isHome ? "order-1" : ""}`}
          >
            {(isHome ? navigation.slice(0, 3) : navigation).map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={`group relative py-4 text-[10px] font-medium uppercase tracking-[.17em] transition-colors duration-500 ${
                    active
                      ? "text-[#e5cca5]"
                      : "text-white/85 hover:text-[#e5cca5]"
                  }`}
                >
                  {item.label}

                  <span
                    className={`absolute bottom-[9px] left-0 h-px bg-[#d3b47d] transition-all duration-500 ${
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {isHome && (
            <nav aria-label="Contact and news" className="order-3 flex items-center justify-end gap-[clamp(18px,2.3vw,42px)]">
              {navigation.slice(3).map((item) => (
                <Link key={item.href} href={item.href} className="hidden py-4 text-[10px] font-medium uppercase tracking-[.17em] text-white/90 transition-colors hover:text-white lg:block">
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" aria-label="Contact us" className="flex min-h-11 min-w-11 items-center justify-center text-[10px] font-medium uppercase tracking-[.17em] text-white/90 hover:text-white">
                <span className="hidden lg:inline">Contact us</span>
                <ArrowUpRight size={20} strokeWidth={1.5} className="lg:hidden" />
              </Link>
            </nav>
          )}

          {/* DESKTOP CTA */}
          {!isHome && (
          <Link
            href="/contact"
            className="group hidden items-center gap-3 border border-[#d4b784]/55 px-5 py-3.5 text-[10px] font-medium uppercase tracking-[.16em] transition-all duration-500 hover:border-[#c5a36c] hover:bg-[#c5a36c] hover:text-[#15130e] lg:inline-flex"
          >
            Private Enquiry

            <ArrowUpRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
          )}

          {/* ANIMATED HAMBURGER */}
          <button
            ref={triggerRef}
            type="button"
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
            aria-controls="meh-mobile-navigation"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className={`relative z-[130] flex h-12 w-12 shrink-0 items-center justify-center transition-colors duration-500 lg:hidden ${isHome ? "order-1 -ml-3" : "border border-white/25 hover:border-[#d3b47d]"}`}
          >
            <span className="relative block h-5 w-6">
              <motion.span
                className="absolute left-0 top-[3px] block h-px w-6 origin-center bg-white"
                animate={
                  menuOpen
                    ? {
                        y: 6,
                        rotate: 45,
                        backgroundColor: "#d9bd8c",
                      }
                    : {
                        y: 0,
                        rotate: 0,
                        backgroundColor: "#ffffff",
                      }
                }
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  ease,
                }}
              />

              <motion.span
                className="absolute left-0 top-[9px] block h-px w-6 bg-white"
                animate={
                  menuOpen
                    ? { scaleX: 0, opacity: 0 }
                    : { scaleX: 1, opacity: 1 }
                }
                transition={{ duration: 0.2 }}
              />

              <motion.span
                className="absolute bottom-[3px] left-0 block h-px w-6 origin-center bg-white"
                animate={
                  menuOpen
                    ? {
                        y: -6,
                        rotate: -45,
                        backgroundColor: "#d9bd8c",
                      }
                    : {
                        y: 0,
                        rotate: 0,
                        backgroundColor: "#ffffff",
                      }
                }
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  ease,
                }}
              />
            </span>
          </button>
        </div>

        {/* 90% WIDTH LUMINOUS SILVER RAIL */}
        {!isHome && <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-[90%] -translate-x-1/2 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
          }}
        >
          {/* Soft ambient glow beneath the line */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a36c]/40 to-transparent shadow-[0_0_12px_rgba(219,226,234,.35)]" />

          {/* The fine architectural line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#a6a9ad]/10 via-[#d5d9df]/65 to-[#a6a9ad]/10" />

          {/* Travelling silver highlight */}
          {!reducedMotion && (
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] w-[22%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(222,228,235,.15) 18%, rgba(255,255,255,.95) 50%, rgba(222,228,235,.15) 82%, transparent 100%)",
                boxShadow:
                  "0 0 8px rgba(240,245,255,.6), 0 0 18px rgba(210,220,235,.28)",
              }}
              animate={{ x: ["-110%", "560%"] }}
              transition={{
                duration: 6.5,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 1.2,
              }}
            />
          )}
        </div>}
      </header>

      {/* CINEMATIC MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="meh-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { clipPath: "inset(0 0 100% 0)" }
            }
            animate={{
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
            }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { clipPath: "inset(0 0 100% 0)" }
            }
            transition={{
              duration: reducedMotion ? 0.2 : 0.85,
              ease,
            }}
            className="fixed inset-0 z-[110] h-[100dvh] overflow-hidden bg-[#10120f] text-white lg:hidden"
          >
            {/* ATMOSPHERIC GLOW */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -right-[30%] top-[15%] h-[80vw] w-[80vw] rounded-full bg-[#b8975a]/[.08] blur-[100px]" />

              <div className="absolute -left-[30%] bottom-0 h-[70vw] w-[70vw] rounded-full bg-[#b8975a]/[.04] blur-[110px]" />
            </div>

            {/* GOLD CURTAIN */}
            {!reducedMotion && (
              <motion.div
                aria-hidden="true"
                initial={{ y: "-100%" }}
                animate={{ y: "110%" }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 1.05,
                  ease,
                }}
                className="pointer-events-none absolute inset-0 z-20 bg-[#c5a36c]"
              />
            )}

            {/* MENU CONTENT */}
            <div className="relative z-10 flex h-full min-h-0 flex-col overflow-y-auto px-8 pb-7 pt-[100px] sm:px-12 sm:pt-[125px]">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: reducedMotion ? 0 : 0.45,
                  duration: 0.7,
                }}
                className="mb-5 text-[10px] uppercase tracking-[.3em] text-[#d7b981]"
              >
                Explore MEH Realty
              </motion.p>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-1 flex-col justify-center"
              >
                {navigation.map((item, index) => {
                  const active = isActive(item.href);

                  return (
                    <div
                      key={item.href}
                      className="overflow-hidden border-b border-white/10"
                    >
                      <motion.div
                        initial={{
                          y: reducedMotion ? 0 : "110%",
                          opacity: 0,
                        }}
                        animate={{
                          y: "0%",
                          opacity: 1,
                        }}
                        exit={{
                          y: reducedMotion ? 0 : "110%",
                          opacity: 0,
                        }}
                        transition={{
                          duration: reducedMotion
                            ? 0.15
                            : 0.8,
                          delay: reducedMotion
                            ? 0
                            : 0.35 + index * 0.1,
                          ease: revealEase,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() =>
                            setMenuOpen(false)
                          }
                          aria-current={
                            active ? "page" : undefined
                          }
                          className="group flex items-center justify-between gap-4 py-[clamp(12px,2.4vh,24px)]"
                        >
                          <span
                            className={`font-[family-name:var(--font-fraunces)] text-[clamp(2rem,6.5vw,4.3rem)] font-light tracking-[-.045em] transition-all duration-500 ${
                              active
                                ? "italic text-[#e5cca5]"
                                : "text-white group-hover:translate-x-2 group-hover:italic group-hover:text-[#e5cca5]"
                            }`}
                          >
                            {item.label}
                          </span>

                          <ArrowUpRight
                            size={19}
                            strokeWidth={1.2}
                            className="shrink-0 text-[#d7b981]/70 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                          />
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>

              {/* MOBILE CTA */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: reducedMotion ? 0 : 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: reducedMotion ? 0 : 0.9,
                  duration: 0.65,
                  ease: revealEase,
                }}
                className="mt-7 shrink-0"
              >
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="group flex min-h-[56px] items-center justify-between gap-4 bg-[#c5a36c] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.15em] text-[#15130e] transition-colors duration-500 hover:bg-[#e5cca5]"
                >
                  Make a Private Enquiry

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                    className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-6 text-center font-[family-name:var(--font-fraunces)] text-[15px] font-light italic text-white/40">
                  The art of considered living.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERNAL PAGE OFFSET */}
      {!isHome && (
        <div
          aria-hidden="true"
          className="h-[76px] sm:h-[88px] lg:h-[96px]"
        />
      )}
    </>
  );
}
