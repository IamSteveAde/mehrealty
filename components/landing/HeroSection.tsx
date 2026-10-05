"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="meh-reference-hero">
      <div className="hero-media" aria-hidden="true">
        <Image
          src="/uploads/report/report2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-caption">
        <h1 id="hero-heading">MEH Realty</h1>
        <p>Where considered living begins</p>
        <Link href="/developments" className="hero-discover">Discover</Link>
      </div>

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
        .hero-shade {
          background: linear-gradient(180deg, rgba(0,0,0,.48) 0%, rgba(0,0,0,.3) 35%, rgba(0,0,0,.5) 72%, rgba(0,0,0,.58) 100%);
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
        .hero-caption :global(.hero-discover:focus-visible) {
          outline: 2px solid white;
          outline-offset: 5px;
        }
        @keyframes hero-arrive {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .hero-caption { left: 20px; right: 20px; }
          .hero-caption h1 { font-size: 48px; }
          .hero-caption p { font-size: 14px; margin-top: 12px; }
          .hero-caption :global(.hero-discover) { min-width: 170px; margin-top: 18px; }
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
          .hero-caption :global(.hero-discover) { transition: none; }
        }
      `}</style>
    </section>
  );
}
