
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
} from "lucide-react";
import type { Project } from "@prisma/client";

type FeaturedProjectsSectionProps = {
  projects: Project[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

const SLIDE_DURATION = 5000;

const PROJECT_GALLERIES = [
  {
    name: "Empire",
    images: [
      "/uploads/empire/empire1.webp",
      "/uploads/empire/empire2.png",
      "/uploads/empire/empire3.webp",
      "/uploads/empire/empire4.webp",
      "/uploads/empire/empire5.webp",
      "/uploads/empire/empire6.webp",
    ],
  },
  {
    name: "Report",
    images: [
      "/uploads/report/report1.webp",
      "/uploads/report/report2.webp",
      "/uploads/report/report3.webp",
      "/uploads/report/report4.webp",
      "/uploads/report/report5.webp",
      "/uploads/report/report6.webp",
      "/uploads/report/report7.webp",
    ],
  },
];

function getProjectTitle(project: Project) {
  const data = project as unknown as Record<string, unknown>;

  if (typeof data.name === "string") return data.name;
  if (typeof data.title === "string") return data.title;

  return "MEH Residence";
}

function getProjectLocation(project: Project) {
  const data = project as unknown as Record<string, unknown>;

  if (typeof data.location === "string") {
    return data.location;
  }

  return "A distinguished address";
}

function getProjectHref(project: Project) {
  const data = project as unknown as Record<string, unknown>;

  if (typeof data.slug === "string" && data.slug) {
    return `/developments/${data.slug}`;
  }

  return "/developments";
}

function getProjectImages(project: Project, index: number) {
  const data = project as unknown as Record<string, unknown>;

  const searchableName = [
    data.name,
    data.title,
    data.slug,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string"
    )
    .join(" ")
    .toLowerCase();

  const matchedGallery = PROJECT_GALLERIES.find(
    (gallery) =>
      searchableName.includes(
        gallery.name.toLowerCase()
      )
  );

  if (matchedGallery) return matchedGallery.images;

  return PROJECT_GALLERIES[
    index % PROJECT_GALLERIES.length
  ].images;
}

/* -------------------------------------------------------
   ARCHITECTURAL IMAGE SLIDESHOW
------------------------------------------------------- */

function Slideshow({
  images,
  title,
  index,
  priority = false,
}: {
  images: string[];
  title: string;
  index: number;
  priority?: boolean;
}) {
  const galleryRef = useRef<HTMLDivElement>(null);

  // The slideshow only runs while its gallery is on screen.
  const isInView = useInView(galleryRef, {
    amount: 0.35,
  });

  const reducedMotion = Boolean(useReducedMotion());

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const total = images.length;

  // Stop automatic sliding when the browser tab is hidden.
  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(
        document.visibilityState === "visible"
      );
    };

    updateVisibility();

    document.addEventListener(
      "visibilitychange",
      updateVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        updateVisibility
      );
    };
  }, []);

  const canAutoplay =
    isInView &&
    isPageVisible &&
    !paused &&
    !reducedMotion &&
    total > 1;

  const next = useCallback(() => {
    if (total <= 1) return;

    setDirection(1);
    setActiveIndex(
      (current) => (current + 1) % total
    );
  }, [total]);

  const previous = useCallback(() => {
    if (total <= 1) return;

    setDirection(-1);
    setActiveIndex(
      (current) => (current - 1 + total) % total
    );
  }, [total]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (total <= 1) return;

      setDirection(
        nextIndex >= activeIndex ? 1 : -1
      );

      setActiveIndex(
        (nextIndex + total) % total
      );
    },
    [activeIndex, total]
  );

  // Wait 5 seconds before changing each slide.
  // This timer starts only when the gallery is visible.
  useEffect(() => {
    if (!canAutoplay) return;

    const timer = window.setTimeout(() => {
      next();
    }, SLIDE_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [canAutoplay, activeIndex, next]);

  const variants = {
    enter: (slideDirection: number) => ({
      opacity: 0,
      scale: reducedMotion ? 1 : 1.045,
      x: reducedMotion
        ? 0
        : slideDirection * 35,
    }),

    center: {
      opacity: 1,
      scale: 1,
      x: 0,
    },

    exit: (slideDirection: number) => ({
      opacity: 0,
      scale: reducedMotion ? 1 : 1.02,
      x: reducedMotion
        ? 0
        : slideDirection * -35,
    }),
  };

  return (
    <div
      ref={galleryRef}
      className="group/gallery relative h-full w-full overflow-hidden bg-[#292a28]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget as Node | null
          )
        ) {
          setPaused(false);
        }
      }}
      aria-label={`${title} image gallery`}
    >
      {/* IMAGES */}
      <AnimatePresence
        mode="popLayout"
        initial={false}
        custom={direction}
      >
        <motion.div
          key={activeIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: reducedMotion ? 0 : 1.1,
            ease: EASE,
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} — architectural view ${
              activeIndex + 1
            }`}
            fill
            priority={
              priority && activeIndex === 0
            }
            sizes="(max-width: 1024px) 100vw, 90vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* IMAGE GRADIENT */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />

      {/* TOP LEFT */}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-3 sm:left-8 sm:top-8">
        <span className="text-[10px] font-medium tracking-[0.2em] text-white/90">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="h-px w-8 bg-white/60" />

        <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">
          MEH Collection
        </span>
      </div>

      {/* IMAGE COUNTER */}
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2 text-white sm:right-8 sm:top-8">
        <span className="font-[family-name:var(--font-fraunces)] text-[22px] font-light">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>

        <span className="text-[11px] text-white/50">
          /
        </span>

        <span className="text-[11px] text-white/60">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* NAVIGATION ARROWS */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={previous}
            aria-label={`Previous ${title} image`}
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-md transition-all duration-300 hover:border-[#d6b67c] hover:bg-[#b8975a] hover:text-[#10110e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-7 sm:h-14 sm:w-14"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.3}
            />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label={`Next ${title} image`}
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-md transition-all duration-300 hover:border-[#d6b67c] hover:bg-[#b8975a] hover:text-[#10110e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-7 sm:h-14 sm:w-14"
          >
            <ArrowRight
              size={20}
              strokeWidth={1.3}
            />
          </button>
        </>
      )}

      {/* SLIDE PROGRESS */}
      <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center gap-2 sm:bottom-8 sm:left-8 sm:right-8">
        {images.map((_, imageIndex) => (
          <button
            key={imageIndex}
            type="button"
            onClick={() => goTo(imageIndex)}
            aria-label={`Show ${title} image ${
              imageIndex + 1
            }`}
            aria-current={
              imageIndex === activeIndex
                ? "true"
                : undefined
            }
            className="group/dot flex h-6 flex-1 items-center"
          >
            <span
              className={`block h-[2px] w-full transition-all duration-500 ${
                imageIndex === activeIndex
                  ? "bg-[#d6b67c]"
                  : "bg-white/40 group-hover/dot:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   SILVER TO GOLD ANIMATED PROPERTY PANEL
------------------------------------------------------- */

function PropertyInformation({
  title,
  location,
  href,
  index,
}: {
  title: string;
  location: string;
  href: string;
  index: number;
}) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <Link
      href={href}
      aria-label={`Explore ${title}`}
      className="meh-property-link group/property relative isolate block overflow-hidden bg-[#1c1d1b] text-white outline-none"
    >
      {/* SILVER BASE BORDER */}
      <div className="pointer-events-none absolute inset-0 z-20 border border-[#a7a9a6]/25 transition-colors duration-500 group-hover/property:border-[#d9bd8d]/60 group-focus-visible/property:border-[#d9bd8d]/80" />

      {/* ANIMATED SILVER-TO-GOLD BORDER */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="meh-property-flow pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover/property:opacity-100 group-focus-visible/property:opacity-100"
        />
      )}

      {/* GOLD GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_90%_50%,rgba(184,151,90,0.16),transparent_48%)] opacity-0 transition-opacity duration-700 group-hover/property:opacity-100 group-focus-visible/property:opacity-100"
      />

      {/* SUBTLE HORIZONTAL LIGHT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-[#e2c78e] to-transparent transition-all duration-1000 group-hover/property:w-full group-focus-visible/property:w-full"
      />

      <div className="relative z-10 grid gap-9 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16 lg:px-14 lg:py-14">
        {/* LEFT SIDE */}
        <div>
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-9 bg-[#b8975a] transition-all duration-500 group-hover/property:w-14 group-hover/property:bg-[#e1c58d]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.21em] text-[#c8a977]">
              {location}
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-fraunces)] text-[clamp(2.5rem,4.4vw,5.5rem)] font-light leading-[1.07] tracking-[-0.045em] text-[#f5f2ec] transition-colors duration-500 group-hover/property:text-[#f1dfb9]">
            {title}
          </h3>

          <p className="mt-5 max-w-[550px] text-[13px] leading-[1.95] text-white/45 transition-colors duration-500 group-hover/property:text-white/65 sm:text-[14px]">
            A distinctive expression of considered
            architecture, refined spaces and the MEH
            approach to living.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-between gap-6 lg:justify-end lg:pb-1">
          <div className="flex flex-col items-start gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 transition-colors duration-500 group-hover/property:text-[#e0c38c]">
              Explore this development
            </span>

            <span className="h-px w-24 bg-gradient-to-r from-[#9e9f9b]/45 to-[#b8975a]/70 transition-all duration-700 group-hover/property:w-36 group-hover/property:from-[#c6c8c3] group-hover/property:to-[#e1c58d]" />
          </div>

          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#aeb0ab]/40 text-[#e4e4df] transition-all duration-500 group-hover/property:rotate-45 group-hover/property:border-[#e1c58d] group-hover/property:bg-[#c5a36c] group-hover/property:text-[#171714] group-hover/property:shadow-[0_0_35px_rgba(197,163,108,0.35)] sm:h-16 sm:w-16">
            <ArrowUpRight
              size={23}
              strokeWidth={1.2}
            />
          </span>
        </div>
      </div>

      {/* COLLECTION INDEX */}
      <span className="pointer-events-none absolute right-6 top-5 font-mono text-[10px] tracking-[0.16em] text-white/20 sm:right-10 lg:right-14">
        {String(index + 1).padStart(2, "0")}
      </span>
    </Link>
  );
}

/* -------------------------------------------------------
   FEATURED DEVELOPMENT
------------------------------------------------------- */

function FeaturedDevelopment({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reducedMotion = Boolean(useReducedMotion());

  const title = getProjectTitle(project);
  const location = getProjectLocation(project);
  const href = getProjectHref(project);
  const images = getProjectImages(project, index);

  return (
    <motion.article
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              y: 40,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.95,
        ease: EASE,
      }}
      className="relative"
    >
      {/* ARCHITECTURAL SLIDESHOW */}
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[21/10]">
        <Slideshow
          images={images}
          title={title}
          index={index}
          priority={index === 0}
        />
      </div>

      {/* FULLY CLICKABLE DARK PROPERTY PANEL */}
      <PropertyInformation
        title={title}
        location={location}
        href={href}
        index={index}
      />
    </motion.article>
  );
}

/* -------------------------------------------------------
   MAIN SECTION
------------------------------------------------------- */

export default function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const featured = projects.slice(0, 2);

  if (!featured.length) return null;

  return (
    <section
      aria-labelledby="featured-projects-heading"
      className="relative overflow-hidden bg-[#eeeae3] py-20 text-[#171714] sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-[90%] max-w-[1800px]">
        {/* SECTION LABEL */}
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 12 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: EASE,
          }}
          className="mb-12 flex items-center justify-between gap-4 border-b border-[#171714]/10 pb-6 lg:mb-20"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#b8975a]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#a2824f]">
              The Collection
            </span>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#171714]/35 sm:block">
            A considered portfolio
          </span>
        </motion.div>

        {/* HEADER */}
        <div className="mb-14 grid items-end gap-9 lg:mb-20 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 24 }
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
            <span className="mb-5 block font-mono text-[10px] tracking-[0.16em] text-[#a2824f]">
              01 — THE MEH PORTFOLIO
            </span>

            <h2
              id="featured-projects-heading"
              className="font-[family-name:var(--font-fraunces)] text-[clamp(3rem,6vw,7rem)] font-light leading-[1.02] tracking-[-0.055em]"
            >
              Places of

              <span className="block italic text-[#b8975a]">
                distinction.
              </span>
            </h2>
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
              duration: 0.8,
              delay: 0.1,
              ease: EASE,
            }}
          >
            <p className="max-w-[420px] text-[14px] leading-[2] text-[#171714]/55 sm:text-[15px]">
              Discover a curated selection of exceptional
              spaces, thoughtfully conceived for the way
              you live and experience the world.
            </p>

            <Link
              href="/developments"
              className="group mt-8 inline-flex items-center gap-5 border-b border-[#b8975a] pb-3 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-[#b8975a]"
            >
              View all developments

              <ArrowUpRight
                size={18}
                strokeWidth={1.2}
                className="text-[#b8975a] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* DEVELOPMENT GALLERIES */}
        <div className="space-y-20 sm:space-y-28 lg:space-y-36">
          {featured.map((project, index) => (
            <FeaturedDevelopment
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* COLLECTION FOOTER */}
        <div className="mt-20 flex flex-col gap-7 border-t border-[#171714]/10 pt-9 sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-fraunces)] text-[clamp(1.5rem,2.6vw,2.7rem)] font-light italic text-[#514b41]">
            Discover spaces that speak for themselves.
          </p>

          <Link
            href="/developments"
            className="group inline-flex items-center gap-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#171714] transition-colors hover:text-[#b8975a]"
          >
            Explore the collection

            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#171714]/20 transition-all duration-300 group-hover:border-[#b8975a] group-hover:bg-[#b8975a] group-hover:text-white">
              <MoveUpRight
                size={19}
                strokeWidth={1.3}
              />
            </span>
          </Link>
        </div>
      </div>

      {/* ANIMATED BORDER STYLES */}
      <style jsx global>{`
        .meh-property-flow {
          padding: 1.5px;
          background: conic-gradient(
            from var(--meh-border-angle, 0deg),
            rgba(180, 184, 181, 0.1) 0deg,
            rgba(218, 221, 217, 0.8) 55deg,
            rgba(240, 242, 239, 1) 85deg,
            rgba(197, 163, 108, 0.85) 135deg,
            rgba(244, 213, 151, 1) 170deg,
            rgba(197, 163, 108, 0.12) 230deg,
            rgba(180, 184, 181, 0.1) 360deg
          );

          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);

          -webkit-mask-composite: xor;
          mask-composite: exclude;

          animation: meh-border-rotate 4s linear infinite;
        }

        @property --meh-border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes meh-border-rotate {
          to {
            --meh-border-angle: 360deg;
          }
        }

        .meh-property-link:hover,
        .meh-property-link:focus-visible {
          box-shadow:
            0 0 0 1px rgba(197, 163, 108, 0.12),
            0 0 35px rgba(197, 163, 108, 0.1),
            0 25px 70px rgba(17, 17, 15, 0.14);
        }

        .meh-property-link {
          transition: box-shadow 700ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .meh-property-flow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
