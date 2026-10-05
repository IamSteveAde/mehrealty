"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section aria-labelledby="cta-heading" className="meh-consultation">
      <div className="consultation-layout">
        <div className="consultation-image">
          <Image src="/uploads/report/report1.webp" alt="Architectural detail at MEH Empire Estate" fill sizes="(max-width: 1023px) 88vw, 53vw" className="object-cover" />
          <div className="consultation-shade" aria-hidden="true" />
          <p className="consultation-eyebrow">An invitation from MEH</p>
          <div className="consultation-title">
            <h2 id="cta-heading"><span>Every great place</span><span>begins with</span><em>a conversation.</em></h2>
            <p>Thoughtful conversations. Meaningful possibilities.</p>
          </div>
        </div>
        <div className="consultation-content">
          <span className="consultation-kicker">Your next chapter</span>
          <h3>Let&apos;s explore <em>what&apos;s possible.</em></h3>
          <p>Your next home. A considered investment. A new partnership. Whatever brings you here, we&apos;d be delighted to hear your story.</p>
          <Link href="/contact" className="consultation-button">Arrange a consultation <ArrowUpRight size={18} strokeWidth={1.3} /></Link>
          <div className="consultation-direct">
            <span>Or connect with us directly</span>
            <a href="tel:+2349159463447"><Phone size={15} strokeWidth={1.3} />+234 915 9463 447</a>
            <a href="mailto:contactus@meh.ae"><Mail size={15} strokeWidth={1.3} />contactus@meh.ae</a>
          </div>
          <Link href="/about" className="consultation-story">Get to know MEH <ArrowUpRight size={14} strokeWidth={1.3} /></Link>
        </div>
      </div>
      <style jsx>{`
        .meh-consultation { background: white; color: #171717; padding: 36px 0 80px; }
        .consultation-layout { display: grid; grid-template-columns: 1.4fr 1fr; width: 83%; max-width: 1320px; margin: 0 auto; }
        .consultation-image { position: relative; min-height: 600px; overflow: hidden; background: #333; color: white; }
        .consultation-shade { position: absolute; inset: 0; background: linear-gradient(180deg, #0003 0%, transparent 35%, #0009 75%, #000b 100%); pointer-events: none; }
        .consultation-eyebrow { position: absolute; top: 40px; left: 40px; right: 40px; font-size: 10px; letter-spacing: .22em; text-transform: uppercase; }
        .consultation-title { position: absolute; left: 40px; right: 40px; bottom: 48px; }
        .consultation-title h2 { max-width: 580px; margin: 0; font-family: var(--font-fraunces), Georgia, serif; font-weight: 300; font-size: clamp(38px, 3.8vw, 60px); line-height: 1.12; letter-spacing: -.035em; }
        .consultation-title h2 em { display: block; margin-top: 5px; color: #e6d2ac; }
        .consultation-title h2 span { display: block; }
        .consultation-title p { margin-top: 26px; font-size: 11px; letter-spacing: .09em; line-height: 1.8; color: #ffffffe0; }
        .consultation-content { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 54px 44px; background: #f2f0eb; }
        .consultation-kicker { font-size: 10px; line-height: 1.5; letter-spacing: .2em; text-transform: uppercase; color: #8c744c; }
        .consultation-content h3 { margin: 24px 0 0; font-family: var(--font-fraunces), Georgia, serif; font-size: clamp(30px, 2.7vw, 43px); font-weight: 300; line-height: 1.2; letter-spacing: -.035em; }
        .consultation-content h3 em { display: block; }
        .consultation-content > p { margin-top: 24px; max-width: 370px; font-size: 14px; line-height: 1.9; color: #62615c; }
        .consultation-content :global(.consultation-button) { display: inline-flex; align-items: center; justify-content: space-between; width: 100%; gap: 20px; margin-top: 32px; padding: 17px 24px; min-height: 56px; border: 1px solid #171717; border-radius: 999px; background: #171717; color: white; font-size: 10px; line-height: 1.5; text-transform: uppercase; letter-spacing: .14em; transition: background .25s, border-color .25s; }
        .consultation-content :global(.consultation-button:hover) { background: #746040; border-color: #746040; }
        .consultation-direct { display: flex; flex-direction: column; align-items: flex-start; gap: 13px; width: 100%; margin-top: 30px; padding-top: 24px; border-top: 1px solid #d9d4c9; }
        .consultation-direct > span { font-size: 11px; color: #77736b; margin-bottom: 3px; }
        .consultation-direct a { display: inline-flex; align-items: center; gap: 12px; font-size: 13px; line-height: 1.7; }
        .consultation-content :global(.consultation-story) { display: inline-flex; align-items: center; gap: 12px; margin-top: 25px; min-height: 32px; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: #6f614a; }
        .consultation-direct a:hover { text-decoration: underline; text-underline-offset: 4px; }
        .consultation-content :global(a:focus-visible) { outline: 2px solid #746040; outline-offset: 5px; }
        @media (max-width: 1023px) {
          .consultation-layout { width: 88%; grid-template-columns: 1fr; }
          .consultation-image { min-height: 460px; }
          .consultation-content { padding: 44px; }
          .consultation-content h3 { font-size: 40px; }
          .consultation-content > p { max-width: 580px; }
          .consultation-content :global(.consultation-button) { width: auto; min-width: 290px; }
        }
        @media (max-width: 639px) {
          .meh-consultation { padding: 12px 0 48px; }
          .consultation-image { min-height: 420px; }
          .consultation-eyebrow { top: 28px; left: 26px; right: 26px; font-size: 9px; }
          .consultation-title { left: 26px; right: 26px; bottom: 34px; }
          .consultation-title h2 { font-size: 37px; }
          .consultation-title p { font-size: 10px; margin-top: 20px; }
          .consultation-content { padding: 36px 26px; }
          .consultation-content h3 { font-size: 35px; }
          .consultation-content :global(.consultation-button) { width: 100%; min-width: 0; padding-inline: 20px; }
        }
        @media (prefers-reduced-motion: reduce) { .consultation-content :global(.consultation-button) { transition: none; } }
      `}</style>
    </section>
  );
}
