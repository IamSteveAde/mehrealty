
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
  MapPin,
  MoveUpRight,
} from "lucide-react";
import type { Project } from "@prisma/client";

type FeaturedProjectsSectionProps = {
  projects: Project[];
};

const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE_DURATION = 6500;
const IMAGE_TRANSITION = 1.1;

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

  if (typeof data.name === "string" && data.name.trim()) {
    return data.name;
  }

  if (typeof data.title === "string" && data.title.trim()) {
    return data.title;
  }

  return "MEH Residence";
}

function getProjectLocation(project: Project) {
  const data = project as unknown as Record<string, unknown>;

  if (
    typeof data.location === "string" &&
    data.location.trim()
  ) {
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

function getProjectDescription(project: Project) {
  const data = project as unknown as Record<string, unknown>;

  for (const key of ["excerpt", "description", "summary"]) {
    const value = data[key];

    if (typeof value === "string" && value.trim()) {
      return value.replace(/<[^>]*>/g, "").slice(0, 240);
    }
  }

  return "A distinctive expression of considered architecture, refined spaces and the MEH approach to living.";
}

function getProjectImages(project: Project, index: number) {
  const data = project as unknown as Record<string, unknown>;

  const searchableName = [
    data.name,
    data.title,
    data.slug,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  const matchedGallery = PROJECT_GALLERIES.find((gallery) =>
    searchableName.includes(gallery.name.toLowerCase())
  );

  if (matchedGallery) return matchedGallery.images;

  const gallery = data.gallery;

  if (Array.isArray(gallery)) {
    const valid = gallery.filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0
    );

    if (valid.length) return valid;
  }

  if (typeof gallery === "string") {
    try {
      const parsed: unknown = JSON.parse(gallery);

      if (Array.isArray(parsed)) {
        const valid = parsed.filter(
          (value): value is string =>
            typeof value === "string" &&
            value.trim().length > 0
        );

        if (valid.length) return valid;
      }
    } catch {
      // Gallery is not a JSON array.
    }
  }

  if (typeof data.image === "string" && data.image.trim()) {
    return [data.image];
  }

  return PROJECT_GALLERIES[
    index % PROJECT_GALLERIES.length
  ].images;
}

/* -------------------------------------------------------
   CINEMATIC IMAGE SLIDESHOW
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

  const isInView = useInView(galleryRef, {
    amount: 0.25,
  });

  const reducedMotion = Boolean(useReducedMotion());

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const total = images.length;

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

  const canAnimate =
    isInView &&
    isPageVisible &&
    !paused &&
    !reducedMotion;

  const next = useCallback(() => {
    if (total <= 1) return;

    setActiveIndex((current) => (current + 1) % total);
    setSlideKey((current) => current + 1);
  }, [total]);

  const previous = useCallback(() => {
    if (total <= 1) return;

    setActiveIndex(
      (current) => (current - 1 + total) % total
    );
    setSlideKey((current) => current + 1);
  }, [total]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (total <= 1 || nextIndex === activeIndex) return;

      setActiveIndex((nextIndex + total) % total);
      setSlideKey((current) => current + 1);
    },
    [activeIndex, total]
  );

  useEffect(() => {
    if (!canAnimate || total <= 1) return;

    const timer = window.setTimeout(next, SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [canAnimate, activeIndex, next, total]);

  // Alternate the zoom direction for a more cinematic result.
  const zoomIn = slideKey % 2 === 0;

  return (
    <div
      ref={galleryRef}
      aria-label={`${title} image gallery`}
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
    >
      {/* IMAGE TRANSITIONS */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeIndex}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            opacity: {
              duration: reducedMotion ? 0 : IMAGE_TRANSITION,
              ease: "easeInOut",
            },
          }}
          className="absolute inset-0"
        >
          {/* KEN BURNS ZOOM */}
          <motion.div
            className="absolute inset-0"
            initial={{
              scale: zoomIn ? 1 : 1.12,
            }}
            animate={{
              scale: canAnimate
                ? zoomIn
                  ? 1.12
                  : 1
                : zoomIn
                  ? 1
                  : 1.12,
            }}
            transition={{
              scale: {
                duration: SLIDE_DURATION / 1000,
                ease: "linear",
              },
            }}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} — architectural view ${
                activeIndex + 1
              }`}
              fill
              priority={priority && activeIndex === 0}
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 55vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* IMAGE GRADIENT */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

      {/* TOP LABEL */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2.5 sm:left-6 sm:top-6">
        <span className="text-[10px] font-medium tracking-[0.18em] text-white/90">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="h-px w-6 bg-white/60" />

        <span className="text-[9px] uppercase tracking-[0.16em] text-white/80">
          MEH Collection
        </span>
      </div>

      {/* IMAGE COUNTER */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 text-white sm:right-6 sm:top-6">
        <span className="font-[family-name:var(--font-fraunces)] text-[19px] font-light">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>

        <span className="text-[10px] text-white/50">/</span>

        <span className="text-[10px] text-white/65">
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
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-md transition-all hover:border-[#d6b67c] hover:bg-[#b8975a] hover:text-[#10110e] sm:left-5 sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label={`Next ${title} image`}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-md transition-all hover:border-[#d6b67c] hover:bg-[#b8975a] hover:text-[#10110e] sm:right-5 sm:h-11 sm:w-11"
          >
            <ArrowRight size={18} strokeWidth={1.4} />
          </button>
        </>
      )}

      {/* SLIDE INDICATORS */}
      {total > 1 && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-1.5 sm:bottom-6 sm:left-6 sm:right-6">
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
              className="group/dot flex h-5 flex-1 items-center"
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
      )}
    </div>
  );
}

/* -------------------------------------------------------
   PROPERTY INFORMATION PANEL
------------------------------------------------------- */

function PropertyInformation({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const title = getProjectTitle(project);
  const location = getProjectLocation(project);
  const href = getProjectHref(project);

  return (
    <Link
      href={href}
      aria-label={`Explore ${title}`}
      className="group/property relative isolate flex min-w-0 flex-1 flex-col justify-between overflow-hidden bg-[#1c1d1b] px-6 py-8 text-white outline-none sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-14"
    >
      <div className="pointer-events-none absolute inset-0 border border-[#a7a9a6]/20 transition-colors duration-500 group-hover/property:border-[#d9bd8d]/60" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_90%,rgba(184,151,90,0.17),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover/property:opacity-100"
      />

      <div className="relative z-10">
        <div className="mb-7 flex items-center gap-3">
          <span className="h-px w-7 bg-[#b8975a]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#c8a977]">
            Featured Development
          </span>
        </div>

        <span className="mb-5 block font-mono text-[10px] tracking-[0.15em] text-white/30">
          RESIDENCE / {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="max-w-[600px] font-[family-name:var(--font-fraunces)] text-[clamp(2.2rem,3.5vw,4.7rem)] font-light leading-[1.06] tracking-[-0.045em] text-[#f5f2ec] transition-colors duration-500 group-hover/property:text-[#f1dfb9]">
          {title}
        </h3>

        <div className="mt-6 flex items-start gap-2 text-[#c8a977]">
          <MapPin
            size={15}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0"
          />

          <span className="text-[11px] uppercase tracking-[0.13em]">
            {location}
          </span>
        </div>

        <p className="mt-7 max-w-[470px] text-[13px] leading-[1.9] text-white/55 sm:text-[14px]">
          {getProjectDescription(project)}
        </p>
      </div>

      <div className="relative z-10 mt-10 flex items-end justify-between gap-5 border-t border-white/15 pt-6">
        <div>
          <span className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/45">
            Discover more
          </span>

          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#e0c38c]">
            Explore this development
          </span>
        </div>

        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#aeb0ab]/40 text-[#e4e4df] transition-all duration-500 group-hover/property:rotate-45 group-hover/property:border-[#e1c58d] group-hover/property:bg-[#c5a36c] group-hover/property:text-[#171714] sm:h-14 sm:w-14">
          <ArrowUpRight size={21} strokeWidth={1.3} />
        </span>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------
   SIDE-BY-SIDE FEATURED DEVELOPMENT
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
  const images = getProjectImages(project, index);

  return (
    <motion.article
      initial={
        reducedMotion
          ? false
          : { opacity: 0, y: 32 }
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
        duration: 0.85,
        ease: EASE,
      }}
      className="relative flex flex-col overflow-hidden shadow-[0_22px_60px_rgba(20,20,18,0.08)] md:min-h-[470px] md:flex-row lg:min-h-[540px] xl:min-h-[600px]"
    >
      {/* LEFT: ANIMATED IMAGE GALLERY */}
      <div className="relative h-[320px] w-full shrink-0 overflow-hidden sm:h-[420px] md:h-auto md:w-[52%] lg:w-[55%]">
        <Slideshow
          images={images}
          title={title}
          index={index}
          priority={index === 0}
        />
      </div>

      {/* RIGHT: DEVELOPMENT DETAILS */}
      <PropertyInformation
        project={project}
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
      className="relative overflow-hidden bg-[#eeeae3] py-16 text-[#171714] sm:py-24 lg:py-32"
    >
      <div className="mx-auto w-[90%] max-w-[1600px]">
        {/* SECTION LABEL */}
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 12 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: EASE,
          }}
          className="mb-10 flex items-center justify-between gap-4 border-b border-[#171714]/10 pb-5 lg:mb-16"
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

        {/* SECTION HEADING */}
        <div className="mb-12 grid items-end gap-7 lg:mb-16 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 24 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              ease: EASE,
            }}
          >
            <span className="mb-4 block font-mono text-[10px] tracking-[0.16em] text-[#a2824f]">
              01 — THE MEH PORTFOLIO
            </span>

            <h2
              id="featured-projects-heading"
              className="font-[family-name:var(--font-fraunces)] text-[clamp(2.8rem,5vw,6rem)] font-light leading-[1.03] tracking-[-0.055em]"
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: EASE,
            }}
          >
            <p className="max-w-[420px] text-[14px] leading-[1.9] text-[#171714]/55 sm:text-[15px]">
              Discover a curated selection of exceptional
              spaces, thoughtfully conceived for the way
              you live and experience the world.
            </p>

            <Link
              href="/developments"
              className="group mt-7 inline-flex items-center gap-4 border-b border-[#b8975a] pb-3 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-[#b8975a]"
            >
              View all developments

              <ArrowUpRight
                size={17}
                strokeWidth={1.2}
                className="text-[#b8975a] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* DEVELOPMENT CARDS */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {featured.map((project, index) => (
            <FeaturedDevelopment
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-16 flex flex-col gap-6 border-t border-[#171714]/10 pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-fraunces)] text-[clamp(1.4rem,2.4vw,2.4rem)] font-light italic text-[#514b41]">
            Discover spaces that speak for themselves.
          </p>

          <Link
            href="/developments"
            className="group inline-flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.16em] text-[#171714] transition-colors hover:text-[#b8975a]"
          >
            Explore the collection

            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#171714]/20 transition-all duration-300 group-hover:border-[#b8975a] group-hover:bg-[#b8975a] group-hover:text-white">
              <MoveUpRight size={18} strokeWidth={1.3} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
