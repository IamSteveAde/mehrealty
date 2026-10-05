"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";

const releases = [
  { title: "MEH Realty shares its vision for contemporary residential living", image: "/uploads/empire/empire3.webp", date: "01 Oct 2026", isoDate: "2026-10-01" },
  { title: "A closer look at the architecture and spaces of MEH Empire Estate", image: "/uploads/empire/empire5.webp", date: "24 Sep 2026", isoDate: "2026-09-24" },
  { title: "Reportage Tower: a new perspective on considered city living", image: "/uploads/report/report4.webp", date: "17 Sep 2026", isoDate: "2026-09-17" },
  { title: "Thoughtful design and lasting value at the heart of the MEH approach", image: "/uploads/report/report6.webp", date: "10 Sep 2026", isoDate: "2026-09-10" },
];

export default function JournalSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const activeRef = useRef(1);
  const [active, setActive] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (showAll) return;
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const card = track.querySelector<HTMLElement>(".press-item");
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      activeRef.current = Math.min(releases.length - 1, Math.max(0, Math.round(track.scrollLeft / (card.offsetWidth + gap))));
      setActive(activeRef.current);
    };
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(() => {
      const card = track.querySelector<HTMLElement>(".press-item");
      if (card) track.scrollTo({ left: activeRef.current * (card.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0)), behavior: "instant" });
    });
    observer.observe(track);
    return () => { track.removeEventListener("scroll", update); observer.disconnect(); };
  }, [showAll]);

  useEffect(() => {
    if (selected === null) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      lastTrigger.current?.focus();
    };
  }, [selected]);

  function move(direction: number) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".press-item");
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const index = (activeRef.current + direction + releases.length) % releases.length;
    track.scrollTo({ left: index * (card.offsetWidth + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  const autoplay = useCarouselAutoplay({ ref: sectionRef, enabled: !showAll && selected === null, slide: active, advance: () => move(1) });

  return (
    <section ref={sectionRef} aria-labelledby="meh-journal-heading" className="meh-press-section" {...autoplay.interaction}>
      <h2 id="meh-journal-heading">Press Releases</h2>
      <div className="press-carousel">
        <div
          key={showAll ? "grid" : "carousel"}
          ref={trackRef}
          className={`press-track ${showAll ? "press-grid" : ""}`}
          role="region"
          aria-label="MEH press releases"
          tabIndex={showAll ? -1 : 0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || showAll) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
          }}
        >
          {releases.map((release, index) => (
            <article key={release.title} className={`press-item ${index === active ? "is-active" : index < active ? "is-before" : "is-after"}`}>
              <button type="button" className="press-card" onClick={(event) => { lastTrigger.current = event.currentTarget; setSelected(index); }} aria-label={`Read placeholder press release: ${release.title}`}>
                <div className="press-image"><Image src={release.image} alt="MEH residential architecture" fill sizes="(max-width: 639px) 88vw, (max-width: 1023px) 76vw, 60vw" className="object-cover" /></div>
                <div className="press-card-copy">
                  <h3>{release.title}</h3>
                  <div className="press-date"><span>Published on</span><time dateTime={release.isoDate}>{release.date}</time><small>Placeholder</small></div>
                </div>
              </button>
            </article>
          ))}
        </div>
        {!showAll && <>
          <button type="button" className="press-arrow press-previous" aria-label="Previous press release" onClick={() => move(-1)}><ChevronLeft size={40} strokeWidth={1} /></button>
          <button type="button" className="press-arrow press-next" aria-label="Next press release" onClick={() => move(1)}><ChevronRight size={40} strokeWidth={1} /></button>
          <span className="sr-only" role="status">Press release {active + 1} of {releases.length}</span>
        </>}
      </div>
      <div className="press-footer"><button type="button" className="press-view-all" aria-expanded={showAll} onClick={() => { setShowAll(current => !current); activeRef.current = 1; setActive(1); }}>{showAll ? "Show carousel" : "View all"}</button>{!showAll && <button type="button" className="press-autoplay" aria-label={autoplay.paused ? "Resume press release slideshow" : "Pause press release slideshow"} onClick={autoplay.togglePaused}>{autoplay.paused ? <Play size={15} /> : <Pause size={15} />}</button>}</div>

      {selected !== null && (
        <dialog ref={dialogRef} className="press-dialog" aria-labelledby="press-dialog-title" onCancel={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="press-dialog-top"><span>Placeholder press release</span><button type="button" aria-label="Close press release" autoFocus onClick={() => setSelected(null)}><X size={24} /></button></div>
          <div className="press-dialog-image"><Image src={releases[selected].image} alt="MEH residential architecture" fill sizes="(max-width: 800px) 90vw, 800px" className="object-cover" /></div>
          <h2 id="press-dialog-title">{releases[selected].title}</h2>
          <p>This sample release previews the MEH press layout. Its headline, date and image can be replaced with an approved company announcement.</p>
        </dialog>
      )}

      <style jsx>{`
        .meh-press-section { position: relative; overflow: hidden; background: white; color: #171717; padding: 56px 0 50px; }
        .meh-press-section > h2 { margin: 0 24px 50px; font-family: 'DM Sans', Arial, sans-serif; font-size: 25px; font-weight: 400; line-height: 1.4; letter-spacing: .08em; text-transform: uppercase; text-align: center; }
        .press-carousel { position: relative; }
        .press-track { display: flex; gap: 32px; align-items: center; width: 100%; padding: 5px calc((100vw - min(60vw, 860px)) / 2); overflow-x: auto; scrollbar-width: none; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; }
        .press-track::-webkit-scrollbar { display: none; }
        .press-item { flex: 0 0 min(60vw, 860px); min-width: 0; scroll-snap-align: center; transition: transform .5s ease, opacity .5s ease; }
        .press-item.is-active { transform: scale(1); opacity: 1; }
        .press-item.is-before { transform: scale(.6); transform-origin: right center; opacity: .55; }
        .press-item.is-after { transform: scale(.6); transform-origin: left center; opacity: .55; }
        .press-card { display: block; width: 100%; text-align: left; border: 1px solid #d8d8d8; border-radius: 10px; overflow: hidden; background: white; }
        .press-image { position: relative; aspect-ratio: 372 / 249; background: #efefef; }
        .press-card-copy { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 36px; align-items: start; padding: 30px; min-height: 145px; }
        .press-card-copy h3 { margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; font-weight: 400; line-height: 1.2; color: #444; }
        .press-date { font-size: 14px; line-height: 1.5; white-space: nowrap; }
        .press-date > span { display: block; color: #a4a4a4; }
        .press-date time { display: block; margin-top: 3px; color: #444; }
        .press-date small { display: block; margin-top: 7px; font-size: 10px; color: #888; letter-spacing: .04em; }
        .press-arrow { position: absolute; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 48px; height: 64px; color: #888; background: #ffffffe6; }
        .press-previous { left: 0; }
        .press-next { right: 0; }
        .press-arrow:disabled { opacity: .3; cursor: default; }
        .press-footer { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 24px; padding: 0 24px; }
        .press-autoplay { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid #d8d8d8; border-radius: 50%; }
        .press-view-all { display: inline-flex; align-items: center; justify-content: center; min-width: 215px; min-height: 49px; padding: 14px 28px; border: 1px solid #171717; border-radius: 999px; font-size: 12px; line-height: 1.5; letter-spacing: .22em; text-transform: uppercase; transition: background .25s, color .25s; }
        .press-view-all:hover { background: #171717; color: white; }
        .press-track.press-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; width: 83%; max-width: 1200px; margin: 0 auto; padding: 5px; overflow: visible; }
        .press-grid .press-item { transform: none; opacity: 1; }
        .press-dialog { width: min(800px, 92vw); max-height: 90dvh; border: 0; border-radius: 10px; padding: 24px; color: #171717; background: white; }
        .press-dialog::backdrop { background: #000b; }
        .press-dialog-top { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
        .press-dialog-top span { font-size: 11px; letter-spacing: .13em; text-transform: uppercase; color: #777; }
        .press-dialog-top button { min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; }
        .press-dialog-image { position: relative; aspect-ratio: 16 / 9; }
        .press-dialog h2 { font-size: 32px; line-height: 1.2; margin-top: 24px; }
        .press-dialog > p { margin-top: 20px; font-size: 15px; line-height: 1.8; color: #626262; }
        button:focus-visible, .press-track:focus-visible { outline: 2px solid #555; outline-offset: 4px; }
        @media (max-width: 1023px) {
          .press-track { padding-inline: 12vw; gap: 24px; }
          .press-item { flex-basis: 76vw; }
          .press-card-copy { padding: 24px; gap: 24px; }
          .press-card-copy h3 { font-size: 22px; }
        }
        @media (max-width: 639px) {
          .meh-press-section { padding: 48px 0; }
          .meh-press-section > h2 { font-size: 20px; margin-bottom: 34px; }
          .press-track { padding-inline: 6vw; gap: 16px; }
          .press-item { flex-basis: 88vw; }
          .press-item.is-before, .press-item.is-after { transform: scale(.85); }
          .press-card-copy { grid-template-columns: 1fr; padding: 22px; gap: 18px; min-height: 0; }
          .press-card-copy h3 { font-size: 24px; }
          .press-date { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; }
          .press-date time, .press-date small { margin: 0; }
          .press-arrow { width: 36px; height: 48px; }
          .press-track.press-grid { width: 88%; grid-template-columns: 1fr; gap: 24px; }
          .press-view-all { font-size: 11px; }
          .press-dialog { padding: 16px; }
          .press-dialog h2 { font-size: 27px; }
        }
        @media (prefers-reduced-motion: reduce) { .press-item, .press-view-all { transition: none; } }
      `}</style>
    </section>
  );
}
