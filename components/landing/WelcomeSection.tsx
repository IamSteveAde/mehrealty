"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Play, X } from "lucide-react";

export default function WelcomeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [filmError, setFilmError] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "start start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const easedProgress = useTransform(progress, (value) => 1 - (1 - Math.min(1, Math.max(0, value))) ** 2);
  const scale = useTransform(easedProgress, [0, 1], [0.65, 1]);
  const borderRadius = useTransform(easedProgress, [0, 1], ["50%", "0%"]);
  const animateScroll = !reducedMotion;

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionPreference.matches);
    updateMotion();
    motionPreference.addEventListener("change", updateMotion);
    return () => {
      motionPreference.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    if (!filmOpen) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    filmRef.current?.play().catch(() => {});
    return () => {
      filmRef.current?.pause();
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [filmOpen]);

  return (
    <>
      <section ref={sectionRef} aria-labelledby="welcome-heading" className="meh-welcome-reveal">
        <motion.div className="welcome-panel" style={{
          scale: animateScroll ? scale : 1,
          borderRadius: animateScroll ? borderRadius : "0%",
        }}>
          <div className="welcome-artwork" aria-hidden="true">
            <Image src="/uploads/mehholder.png" alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className="welcome-blend" aria-hidden="true" />
          <div className="welcome-copy">
            <p className="welcome-label">Welcome to MEH Realty</p>
            <h2 id="welcome-heading">
              More than a place to live.
              <em>A way of living.</em>
            </h2>
            <p className="welcome-description">
              We bring together architecture, purposeful design and a considered
              approach to property development and management.
            </p>
            <Link href="/about" className="welcome-discover">Discover our story</Link>
          </div>
          <div className="welcome-film">
            <p className="film-caption">Every space tells a story.</p>
            <button ref={triggerRef} type="button" className="film-trigger" onClick={() => { setFilmError(false); setFilmOpen(true); }}>
              <span className="film-play"><Play size={16} fill="currentColor" strokeWidth={1} /></span>
              <span>The MEH Film<span className="film-subtitle">An introduction to our world</span></span>
            </button>
          </div>
        </motion.div>
      </section>

      {filmOpen && (
        <dialog ref={dialogRef} className="welcome-film-dialog" aria-labelledby="film-title" onCancel={() => setFilmOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setFilmOpen(false); }}>
          <div className="film-dialog-heading">
            <div><h2 id="film-title">An introduction to MEH</h2><p>Discover our philosophy and the spaces we create.</p></div>
            <button type="button" aria-label="Close MEH film" onClick={() => setFilmOpen(false)} autoFocus><X size={24} /></button>
          </div>
          {filmError ? <p className="film-error" role="status">The film is currently unavailable. Please try again later.</p> : (
            <video ref={filmRef} src="/uploads/meh.mp4" poster="/uploads/mehholder.png" controls playsInline preload="metadata" onError={() => setFilmError(true)} />
          )}
        </dialog>
      )}

      <style jsx>{`
        .meh-welcome-reveal { position: relative; z-index: 1; min-height: 100svh; }
        .meh-welcome-reveal :global(.welcome-panel) {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          transform-origin: center center;
          background: white;
          color: #171717;
        }
        .welcome-artwork, .welcome-blend { position: absolute; inset: 0; pointer-events: none; }
        .welcome-artwork :global(img) { object-position: 70% center; }
        .welcome-blend {
          background: linear-gradient(90deg, #fff 0%, #fff 33%, rgba(255,255,255,.95) 40%, rgba(255,255,255,.35) 57%, transparent 72%),
            linear-gradient(180deg, #fff 0%, rgba(255,255,255,.85) 15%, transparent 44%);
        }
        .welcome-copy {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          width: 50%;
          min-height: 100svh;
          padding: 160px 2% 100px 9%;
        }
        .welcome-label { font-size: 10px; line-height: 1.5; letter-spacing: .2em; text-transform: uppercase; margin-bottom: 24px; }
        .welcome-copy h2 {
          max-width: 430px;
          margin: 0;
          font-family: 'DM Sans', Arial, sans-serif;
          font-weight: 600;
          font-size: clamp(28px, 2.8vw, 42px);
          line-height: 1.12;
          letter-spacing: -.025em;
          text-transform: uppercase;
        }
        .welcome-copy h2 em {
          display: block;
          margin-top: 6px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(38px, 3.7vw, 56px);
          font-weight: 400;
          line-height: 1.1;
          text-transform: none;
          letter-spacing: -.02em;
        }
        .welcome-description { max-width: 570px; margin: 36px 0 0; font-size: 19px; line-height: 1.65; font-weight: 400; }
        .welcome-copy :global(.welcome-discover) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 49px;
          min-width: 264px;
          padding: 14px 28px;
          margin-top: 34px;
          border: 1px solid #171717;
          border-radius: 999px;
          font-size: 12px;
          line-height: 1.5;
          letter-spacing: .2em;
          text-transform: uppercase;
          transition: background .25s, color .25s;
        }
        .welcome-copy :global(.welcome-discover:hover) { background: #171717; color: white; }
        .welcome-copy :global(.welcome-discover:focus-visible), .film-trigger:focus-visible { outline: 2px solid #171717; outline-offset: 5px; }
        .welcome-film { position: absolute; right: 6%; bottom: 104px; z-index: 1; color: white; }
        .film-caption { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-style: italic; margin-bottom: 16px; text-shadow: 0 1px 12px #000; }
        .film-trigger { display: inline-flex; align-items: center; gap: 14px; padding: 10px 18px 10px 10px; border: 1px solid #ffffff80; border-radius: 999px; background: #0006; text-align: left; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; transition: background .25s; }
        .film-trigger:hover { background: #0009; }
        .film-play { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px solid #fff8; border-radius: 50%; }
        .film-subtitle { display: block; margin-top: 4px; font-size: 10px; letter-spacing: .03em; text-transform: none; }
        .welcome-film-dialog { width: min(1100px, 94vw); max-height: 92dvh; padding: 20px; border: 0; background: #171717; color: white; }
        .welcome-film-dialog::backdrop { background: #000c; }
        .film-dialog-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
        .film-dialog-heading h2 { font-size: 26px; }
        .film-dialog-heading p { margin-top: 4px; font-size: 12px; color: #fffb; }
        .film-dialog-heading button { display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; }
        .welcome-film-dialog video { display: block; width: 100%; max-height: 75dvh; }
        .film-error { padding: 60px 20px; text-align: center; }
        @media (max-width: 1023px) {
          .meh-welcome-reveal, .meh-welcome-reveal :global(.welcome-panel) { min-height: 0; }
          .welcome-copy { width: 100%; min-height: 0; align-items: center; padding: 90px 28px 60px; text-align: center; }
          .welcome-copy h2 { max-width: 480px; font-size: 32px; }
          .welcome-copy h2 em { font-size: 46px; }
          .welcome-label { margin-bottom: 24px; }
          .welcome-description { max-width: 600px; font-size: 17px; line-height: 1.8; margin-top: 30px; }
          .welcome-copy :global(.welcome-discover) { min-width: 230px; margin-top: 30px; font-size: 11px; }
          .welcome-artwork { top: auto; height: 420px; }
          .welcome-artwork :global(img) { object-position: 65% center; }
          .welcome-blend { display: none; }
          .welcome-film { position: relative; right: auto; bottom: auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 420px; padding: 30px 20px 80px; background: linear-gradient(180deg, white 0%, transparent 18%, transparent 55%, #0006 100%); }
        }
        @media (max-width: 480px) {
          .welcome-copy { padding: 84px 24px 56px; }
          .welcome-copy h2 { font-size: 29px; }
          .welcome-copy h2 em { font-size: 43px; }
          .welcome-artwork, .welcome-film { height: 360px; }
          .welcome-film-dialog { padding: 12px; }
          .film-dialog-heading h2 { font-size: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .welcome-copy :global(.welcome-discover), .film-trigger { transition: none; }
        }
      `}</style>
    </>
  );
}
