"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

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


export default function JourneySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [range, setRange] = useState({ first: 1, last: 3 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const card = track.querySelector<HTMLElement>(".journey-pillar");
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = card.offsetWidth + gap;
      const first = Math.round(track.scrollLeft / step) + 1;
      const visible = Math.max(1, Math.round((track.clientWidth + gap) / step));
      setCanGoBack(track.scrollLeft > 2);
      setCanGoForward(track.scrollLeft < track.scrollWidth - track.clientWidth - 2);
      setRange({ first, last: Math.min(journeyRoutes.length, first + visible - 1) });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  function move(direction: number) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".journey-pillar");
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <section aria-labelledby="journey-heading" className="meh-journey-pillars">
      <div className="journey-container">
        <header className="journey-introduction">
          <div className="journey-heading-row">
            <span aria-hidden="true" />
            <h2 id="journey-heading">What brings you <em>to MEH?</em></h2>
            <span aria-hidden="true" />
          </div>
          <p>Every ambition begins somewhere. Whether you&apos;re looking for a home, an investment, or a trusted partner, your journey starts here.</p>
        </header>

        <motion.div
          ref={trackRef}
          id="meh-journey-track"
          role="region"
          aria-label="MEH services"
          tabIndex={0}
          className="journey-track"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          {journeyRoutes.map((route) => (
            <article key={route.n} className="journey-pillar">
              <Link href={route.href} className="pillar-image" aria-label={`Explore ${route.title}`}>
                <Image src={route.image} alt={`${route.title} — ${route.imageLabel}`} fill sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 88vw" className="object-contain" />
              </Link>
              <div className="pillar-copy">
                <h3><Link href={route.href}>{route.title}</Link></h3>
                <p>{route.text}</p>
                <Link href={route.href} className="pillar-link">Explore <ArrowUpRight size={16} strokeWidth={1.3} /></Link>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="journey-controls">
          <span role="status" aria-live="polite" className="sr-only">Showing services {range.first} to {range.last} of {journeyRoutes.length}</span>
          <button type="button" aria-label="Previous services" aria-controls="meh-journey-track" disabled={!canGoBack} onClick={() => move(-1)}><ArrowLeft size={27} strokeWidth={1} /></button>
          <button type="button" aria-label="Next services" aria-controls="meh-journey-track" disabled={!canGoForward} onClick={() => move(1)}><ArrowRight size={27} strokeWidth={1} /></button>
        </div>
        <footer className="journey-footer">
          <p>Thoughtfully considered. Distinctly MEH.</p>
          <Link href="/contact">Speak with our team <ArrowUpRight size={16} strokeWidth={1.3} /></Link>
        </footer>
      </div>

      <style jsx>{`
        .meh-journey-pillars { position: relative; background: #efefef; color: #252525; padding: 56px 0 70px; }
        .journey-container { width: 83%; max-width: 1320px; margin: 0 auto; }
        .journey-introduction { margin-bottom: 70px; text-align: center; }
        .journey-heading-row { display: flex; align-items: center; justify-content: center; gap: 30px; }
        .journey-heading-row > span { height: 1px; flex: 1; background: #dedede; }
        .journey-heading-row h2 { margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 25px; font-weight: 400; line-height: 1.35; letter-spacing: .055em; text-transform: uppercase; }
        .journey-heading-row em { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 400; letter-spacing: 0; text-transform: none; }
        .journey-introduction > p { max-width: 730px; margin: 20px auto 0; font-size: 15px; line-height: 1.8; color: #626262; }
        .journey-container :global(.journey-track) { display: flex; gap: 20px; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 4px 0 8px; }
        .journey-container :global(.journey-track::-webkit-scrollbar) { display: none; }
        .journey-container :global(.journey-track:focus-visible) { outline: 1px solid #555; outline-offset: 6px; }
        .journey-pillar { flex: 0 0 calc((100% - 40px) / 3); min-width: 0; scroll-snap-align: start; }
        .journey-pillar:nth-child(even) { padding-top: 94px; }
        .journey-pillar :global(.pillar-image) { position: relative; display: block; width: 100%; aspect-ratio: 376 / 445; border-radius: 6px; overflow: hidden; background: #e4e4e4; }
        .journey-pillar :global(.pillar-image img) { filter: grayscale(1); padding: 12px; transition: transform .65s ease; }
        .journey-pillar :global(.pillar-image:hover img) { transform: scale(1.035); }
        .pillar-copy { margin-left: 19%; padding: 76px 12px 12px 22px; border-left: 1px solid #ddd; }
        .pillar-copy h3 { max-width: 270px; margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 34px; font-weight: 400; line-height: 1.15; letter-spacing: -.02em; color: #4a4a4a; }
        .pillar-copy h3 :global(a:hover) { color: #171717; }
        .pillar-copy p { margin: 25px 0 0; max-width: 280px; color: #626262; font-size: 18px; line-height: 1.65; }
        .pillar-copy :global(.pillar-link) { display: inline-flex; align-items: center; gap: 16px; margin-top: 26px; padding: 8px 0; font-size: 10px; letter-spacing: .18em; text-transform: uppercase; }
        .journey-controls { display: flex; justify-content: center; gap: 20px; margin-top: 40px; }
        .journey-controls button { display: flex; align-items: center; justify-content: center; height: 48px; width: 48px; transition: color .2s; }
        .journey-controls button:hover:not(:disabled) { color: #8b7554; }
        .journey-controls button:disabled { opacity: .25; cursor: default; }
        .journey-footer { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: 36px; padding-top: 26px; border-top: 1px solid #dedede; font-size: 12px; color: #626262; }
        .journey-footer :global(a) { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; color: #252525; }
        .journey-pillar :global(a:focus-visible), .journey-controls button:focus-visible, .journey-footer :global(a:focus-visible) { outline: 2px solid #555; outline-offset: 4px; }
        @media (max-width: 1023px) {
          .journey-container { width: 88%; }
          .journey-pillar { flex-basis: calc((100% - 20px) / 2); }
          .journey-pillar:nth-child(even) { padding-top: 55px; }
          .pillar-copy { margin-left: 12%; padding: 44px 10px 12px 20px; }
          .pillar-copy h3 { font-size: 31px; }
          .pillar-copy p { font-size: 16px; }
        }
        @media (max-width: 639px) {
          .meh-journey-pillars { padding: 48px 0; }
          .journey-heading-row { gap: 12px; }
          .journey-heading-row h2 { font-size: 19px; letter-spacing: .025em; }
          .journey-heading-row em { font-size: 26px; }
          .journey-introduction { margin-bottom: 36px; }
          .journey-introduction > p { font-size: 14px; margin-top: 18px; }
          .journey-pillar { flex-basis: 100%; }
          .journey-pillar:nth-child(even) { padding-top: 0; }
          .pillar-copy { margin-left: 12%; padding-top: 32px; }
          .pillar-copy h3 { font-size: 34px; }
          .pillar-copy p { margin-top: 20px; }
          .journey-controls { margin-top: 24px; }
          .journey-footer { flex-direction: column; text-align: center; gap: 10px; margin-top: 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-container :global(.journey-track) { opacity: 1 !important; transform: none !important; }
          .journey-pillar :global(.pillar-image img), .journey-controls button { transition: none; }
          .journey-pillar :global(.pillar-image:hover img) { transform: none; }
        }
      `}</style>
    </section>
  );
}
