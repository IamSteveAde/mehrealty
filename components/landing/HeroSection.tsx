"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (visible && pageVisible && !paused && (!reducedMotion || playRequested)) {
      video.play().then(() => setPlaying(!video.paused)).catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [visible, pageVisible, paused, reducedMotion, playRequested]);

  function togglePlayback() {
    if (videoRef.current && !videoRef.current.paused) {
      setPaused(true);
      videoRef.current?.pause();
    } else {
      setPaused(false);
      setPlayRequested(true);
      videoRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <section ref={sectionRef} aria-labelledby="hero-heading" className="meh-reference-hero">
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/uploads/hero-poster.jpg"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setVideoFailed(true)}
          style={{ visibility: videoFailed ? "hidden" : "visible" }}
        >
          <source src="/uploads/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-caption">
        <h1 id="hero-heading">MEH Realty</h1>
        <p>Where considered living begins</p>
        <Link href="/developments" className="hero-discover">Discover</Link>
      </div>

      {!videoFailed && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="hero-playback"
        >
          {playing ? <Pause size={14} strokeWidth={1.5} /> : <Play size={14} strokeWidth={1.5} />}
        </button>
      )}

      <style jsx>{`
        .meh-reference-hero {
          position: sticky;
          top: 0;
          isolation: isolate;
          height: 100svh;
          min-height: 480px;
          overflow: hidden;
          color: white;
          background: #202421;
        }
        .hero-media, .hero-shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hero-media {
          background: url('/uploads/hero-poster.jpg') center / cover no-repeat;
        }
        .hero-media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .hero-shade {
          background: linear-gradient(180deg, rgba(0,0,0,.28) 0%, transparent 28%, transparent 45%, rgba(0,0,0,.22) 72%, rgba(0,0,0,.3) 100%);
        }
        .hero-caption {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 22.5%;
          text-align: center;
          animation: hero-arrive 1.2s ease-out both;
        }
        .hero-caption h1 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(48px, 4.3vw, 64px);
          font-weight: 400;
          line-height: 1.12;
          letter-spacing: .01em;
          text-shadow: 0 2px 18px rgba(0,0,0,.2);
        }
        .hero-caption p {
          margin: 14px 0 0;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          text-shadow: 0 1px 10px rgba(0,0,0,.35);
        }
        .hero-caption :global(.hero-discover) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 180px;
          min-height: 48px;
          margin-top: 20px;
          padding: 14px 30px;
          border: 1px solid transparent;
          border-radius: 999px;
          background: #a69a9b;
          color: white;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: .34em;
          text-transform: uppercase;
          transition: background .25s ease, border-color .25s ease;
        }
        .hero-caption :global(.hero-discover:hover) {
          background: #8e8182;
          border-color: rgba(255,255,255,.65);
        }
        .hero-caption :global(.hero-discover:focus-visible), .hero-playback:focus-visible {
          outline: 2px solid white;
          outline-offset: 5px;
        }
        .hero-playback {
          position: absolute;
          bottom: 22px;
          left: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255,255,255,.4);
          border-radius: 50%;
          color: white;
          background: rgba(0,0,0,.15);
          transition: background .25s ease;
        }
        .hero-playback:hover { background: rgba(0,0,0,.4); }
        @keyframes hero-arrive {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .hero-caption { left: 20px; right: 20px; }
          .hero-caption h1 { font-size: 48px; }
          .hero-caption p { font-size: 14px; margin-top: 12px; }
          .hero-caption :global(.hero-discover) { min-width: 170px; margin-top: 18px; }
          .hero-playback { bottom: max(16px, env(safe-area-inset-bottom)); left: 68px; }
        }
        @media (max-height: 500px) and (min-width: 768px) {
          .meh-reference-hero { min-height: 360px; }
          .hero-caption { bottom: 12%; }
          .hero-caption h1 { font-size: 42px; }
          .hero-caption p { margin-top: 8px; }
          .hero-caption :global(.hero-discover) { margin-top: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-caption { animation: none; }
          .hero-caption :global(.hero-discover), .hero-playback { transition: none; }
        }
      `}</style>
    </section>
  );
}
