"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Clapperboard, Dumbbell, MapPin, Pause, Play, Waves, Wifi } from "lucide-react";
import type { Project } from "@prisma/client";
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";

type FeaturedProjectsSectionProps = { projects: Project[] };

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


const HOME_FEATURES = [
  { text: "Smart Home", Icon: Wifi },
  { text: "Home Cinema", Icon: Clapperboard },
  { text: "Swimming Pool", Icon: Waves },
  { text: "Fitness Centre", Icon: Dumbbell },
];

function ProjectShowcase({ projects }: FeaturedProjectsSectionProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start 75%", "start 20%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(progress, [0, 1], [0.85, 1]);
  const project = projects[Math.min(active, projects.length - 1)];
  const title = getProjectTitle(project);
  const href = getProjectHref(project);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layout = window.matchMedia("(min-width: 1024px)");
    const update = () => { setReduceMotion(motionPreference.matches); setDesktop(layout.matches); };
    update();
    motionPreference.addEventListener("change", update);
    layout.addEventListener("change", update);
    return () => { motionPreference.removeEventListener("change", update); layout.removeEventListener("change", update); };
  }, []);

  function changeProject(direction: number) {
    setActive(current => (current + direction + projects.length) % projects.length);
  }

  const autoplay = useCarouselAutoplay({ ref: stageRef, enabled: projects.length > 1, slide: active, advance: () => changeProject(1) });

  return (
    <div ref={stageRef} className="property-stage-anchor" {...autoplay.interaction}>
      <motion.div className="property-stage" style={{ scale: desktop && !reduceMotion ? scale : 1 }}>
        <div
          className="property-banner"
          role="region"
          aria-label="Featured developments"
          aria-roledescription="carousel"
          onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start || projects.length < 2) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) changeProject(dx < 0 ? 1 : -1);
          }}
        >
          <Link href={href} className="property-image-link" aria-label={`Explore ${title}`}>
            <motion.div key={project.id} className="absolute inset-0" initial={reduceMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65 }}>
              <Image src={getProjectImages(project, active)[0]} alt={`${title} — architectural view`} fill sizes="100vw" className="object-cover" />
            </motion.div>
          </Link>
          {projects.length > 1 && <>
            <button type="button" className="property-arrow previous" aria-label="Previous development" onClick={() => changeProject(-1)}><ChevronLeft size={42} strokeWidth={1} /></button>
            <button type="button" className="property-arrow next" aria-label="Next development" onClick={() => changeProject(1)}><ChevronRight size={42} strokeWidth={1} /></button>
            <button type="button" className="property-autoplay" aria-label={autoplay.paused ? "Resume development slideshow" : "Pause development slideshow"} onClick={autoplay.togglePaused}>{autoplay.paused ? <Play size={15} /> : <Pause size={15} />}</button>
          </>}
        </div>

        <div className="property-details" aria-live={autoplay.paused ? "polite" : "off"} aria-atomic="true">
          <div className="property-identity">
            <Link href={href} className="property-title">{title}</Link>
            <p><MapPin size={12} strokeWidth={1.3} />{getProjectLocation(project)}</p>
          </div>
          <ul className="property-amenities">
            {HOME_FEATURES.map(({ text, Icon }) => <li key={text}><Icon size={35} strokeWidth={1} aria-hidden="true" /><span>{text}</span></li>)}
          </ul>
          <span className="sr-only">Development {active + 1} of {projects.length}. {getProjectDescription(project)}</span>
        </div>
      </motion.div>

      <style jsx>{`
        .property-stage-anchor { width: 100%; }
        .property-stage-anchor :global(.property-stage) { width: 100%; transform-origin: center top; }
        .property-banner { position: relative; width: 100%; aspect-ratio: 1440 / 620; background: #d7d7d7; overflow: hidden; touch-action: pan-y; }
        .property-banner :global(.property-image-link) { display: block; position: absolute; inset: 0; }
        .property-arrow { position: absolute; z-index: 1; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 52px; height: 64px; color: white; background: #0002; transition: background .2s; }
        .property-arrow:hover { background: #0005; }
        .previous { left: 0; }
        .next { right: 0; }
        .property-autoplay { position: absolute; right: 16px; bottom: 16px; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid #fff9; border-radius: 50%; color: white; background: #0004; }
        .property-autoplay:focus-visible { outline: 2px solid white; outline-offset: 3px; }
        .property-details { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 3fr); align-items: center; width: 83%; max-width: 1320px; min-height: 151px; margin: 0 auto; gap: 26px; padding: 28px 0; }
        .property-identity { text-align: center; }
        .property-identity :global(.property-title) { font-family: var(--font-fraunces), Georgia, serif; font-size: 29px; font-weight: 300; font-style: italic; text-transform: uppercase; line-height: 1.15; }
        .property-identity p { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 10px; line-height: 1.5; letter-spacing: .05em; text-transform: uppercase; color: #555; }
        .property-amenities { display: flex; align-items: stretch; list-style: none; padding: 0; margin: 0; }
        .property-amenities li { flex: 1; min-width: 0; display: flex; align-items: center; gap: 16px; min-height: 72px; padding: 12px 20px; }
        .property-amenities li + li { border-left: 1px solid #b99a77; }
        .property-amenities :global(svg) { flex-shrink: 0; }
        .property-amenities span { font-size: 11px; line-height: 1.6; text-transform: uppercase; color: #393939; overflow-wrap: anywhere; }
        .property-banner :global(a:focus-visible), .property-identity :global(a:focus-visible), .property-arrow:focus-visible { outline: 2px solid #171717; outline-offset: -5px; }
        .property-arrow:focus-visible { outline-color: white; }
        @media (max-width: 1023px) {
          .property-details { width: 88%; grid-template-columns: 1fr; gap: 24px; padding: 28px 0; }
          .property-amenities { justify-content: center; }
          .property-amenities li { justify-content: center; }
        }
        @media (max-width: 639px) {
          .property-banner { aspect-ratio: 390 / 430; }
          .property-arrow { width: 44px; height: 56px; }
          .property-identity :global(.property-title) { font-size: 32px; }
          .property-details { padding-top: 26px; gap: 24px; }
          .property-amenities { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .property-amenities li { justify-content: flex-start; gap: 10px; padding: 12px; min-height: 78px; }
          .property-amenities li + li { border-left: 0; }
          .property-amenities li:nth-child(even) { border-left: 1px solid #b99a77; }
          .property-amenities li:nth-child(n+3) { border-top: 1px solid #d8d2ca; }
          .property-amenities :global(svg) { width: 28px; height: 28px; }
          .property-amenities span { font-size: 10px; }
        }
        @media (prefers-reduced-motion: reduce) { .property-arrow { transition: none; } }
      `}</style>
    </div>
  );
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (!projects.length) return null;
  return (
    <section aria-labelledby="featured-projects-heading" className="meh-property-collection">
      <header className="collection-heading">
        <span aria-hidden="true" />
        <h2 id="featured-projects-heading">Explore our exceptional MEH properties</h2>
        <span aria-hidden="true" />
      </header>
      <p className="collection-introduction">Discover a curated selection of exceptional spaces, thoughtfully conceived for the way you live and experience the world.</p>
      <ProjectShowcase projects={projects} />
      <div className="collection-footer"><Link href="/developments" className="collection-explore">Explore all</Link></div>
      <style jsx>{`
        .meh-property-collection { position: relative; overflow: hidden; background: #efefef; color: #171717; padding-top: 56px; }
        .collection-heading { display: flex; align-items: center; justify-content: center; gap: 30px; width: 83%; max-width: 1320px; margin: 0 auto; }
        .collection-heading > span { flex: 1; height: 1px; background: #dedede; }
        .collection-heading h2 { margin: 0; max-width: 850px; font-family: 'DM Sans', Arial, sans-serif; font-size: 25px; font-weight: 400; line-height: 1.4; letter-spacing: .055em; text-transform: uppercase; text-align: center; }
        .collection-introduction { max-width: 760px; padding: 0 24px; margin: 20px auto 36px; font-size: 14px; line-height: 1.8; color: #626262; text-align: center; }
        .collection-footer { display: flex; justify-content: center; padding: 0 24px 50px; }
        .collection-footer :global(.collection-explore) { display: inline-flex; align-items: center; justify-content: center; min-width: 264px; min-height: 49px; padding: 14px 28px; border: 1px solid #171717; border-radius: 999px; font-size: 12px; line-height: 1.5; letter-spacing: .22em; text-transform: uppercase; transition: background .25s, color .25s; }
        .collection-footer :global(.collection-explore:hover) { background: #171717; color: white; }
        .collection-footer :global(.collection-explore:focus-visible) { outline: 2px solid #171717; outline-offset: 5px; }
        @media (max-width: 639px) { .meh-property-collection { padding-top: 44px; } .collection-heading { width: 88%; gap: 12px; } .collection-heading h2 { font-size: 19px; letter-spacing: .025em; } .collection-introduction { margin-bottom: 28px; font-size: 13px; } .collection-footer { padding: 10px 24px 50px; } .collection-footer :global(.collection-explore) { min-width: 215px; font-size: 11px; } }
        @media (prefers-reduced-motion: reduce) { .collection-footer :global(.collection-explore) { transition: none; } }
      `}</style>
    </section>
  );
}
