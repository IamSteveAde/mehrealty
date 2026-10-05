"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about" },
  { label: "Developments", href: "/developments" },
  { label: "The Journal", href: "/journal" },
  { label: "Media Gallery", href: "/media" },
  { label: "Contact Us", href: "/contact" },
];
const expertise = [
  { label: "Property Development", href: "/services" },
  { label: "Investment Advisory", href: "/services#investment" },
  { label: "Property Management", href: "/services#management" },
  { label: "Hospitality & Partnerships", href: "/services#hospitality" },
];
const developments = [
  { label: "MEH Empire Estate", href: "/developments/meh-empire-estate" },
  { label: "Reportage Tower", href: "/developments/reportage-tower" },
  { label: "Explore All Developments", href: "/developments" },
];

export default function Footer() {
  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Africa/Lagos" }).format(new Date());
  return (
    <footer className="meh-reference-footer">
      <div className="footer-brand">
        <span aria-hidden="true" />
        <Link href="/" aria-label="MEH Realty home" className="footer-logo"><Image src="/uploads/logo.png" alt="MEH Realty" width={240} height={90} className="h-auto w-full" /></Link>
        <span aria-hidden="true" />
      </div>
      <div className="footer-inner">
        <div className="footer-columns">
          <nav aria-label="Footer developments"><h2>Developments</h2>{developments.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
          <nav aria-label="Footer navigation"><h2>Explore MEH</h2>{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
          <nav aria-label="Footer services"><h2>Our Expertise</h2>{expertise.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
          <div className="footer-contact">
            <h2>Connect With Us</h2>
            <p><MapPin size={16} strokeWidth={1.2} /><span>Parkview Estate, Ikoyi<br />Lagos, Nigeria</span></p>
            <a href="tel:+2349159463447"><Phone size={16} strokeWidth={1.2} />+234 915 9463 447</a>
            <a href="mailto:contactus@meh.ae"><Mail size={16} strokeWidth={1.2} />contactus@meh.ae</a>
            <Link href="/contact" className="footer-enquiry">Make an enquiry <ArrowUpRight size={15} strokeWidth={1.2} /></Link>
          </div>
        </div>
        <div className="footer-perspective">
          <div><span>Considered living. Lasting value.</span><p>More than a place. <em>A way of living.</em></p></div>
          <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><ArrowUp size={19} strokeWidth={1.2} /><span>Back to top</span></button>
        </div>
        <div className="footer-bottom"><p>© {year} MEH Realty Limited. All rights reserved.</p><div><button type="button" className="footer-introduction" onClick={(event) => window.dispatchEvent(new CustomEvent("meh:open-introduction", { detail: { trigger: event.currentTarget } }))}>Meet MEH</button><Link href="/about">Our Story</Link><Link href="/contact">Contact Us</Link><span>Thoughtfully conceived. Exceptionally lived.</span></div></div>
      </div>
      <style jsx>{`
        .meh-reference-footer { position: relative; background: #f8f8f8; color: #252525; padding: 64px 0 32px; }
        .footer-brand { display: flex; align-items: center; justify-content: center; gap: 60px; width: 100%; }
        .footer-brand > span { height: 1px; flex: 1; background: #c9b393; }
        .footer-brand :global(.footer-logo) { display: block; width: 190px; flex-shrink: 0; padding: 8px 0; }
        .footer-inner { width: 83%; max-width: 1320px; margin: 0 auto; }
        .footer-columns { display: grid; grid-template-columns: 1.1fr .9fr 1.2fr 1.1fr; gap: 40px; padding: 54px 0 48px; }
        .footer-columns h2 { margin: 0 0 24px; font-family: 'DM Sans', Arial, sans-serif; font-size: 13px; font-weight: 400; line-height: 1.5; letter-spacing: .12em; text-transform: uppercase; }
        .footer-columns nav { display: flex; flex-direction: column; align-items: flex-start; gap: 13px; }
        .footer-columns nav h2 { margin-bottom: 11px; }
        .footer-columns nav :global(a) { display: inline-flex; align-items: center; min-height: 28px; font-size: 12px; line-height: 1.7; color: #626262; }
        .footer-contact { min-width: 0; }
        .footer-contact > p, .footer-contact > a { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 16px; font-size: 12px; line-height: 1.8; color: #626262; overflow-wrap: anywhere; }
        .footer-contact :global(svg) { flex-shrink: 0; margin-top: 3px; }
        .footer-contact :global(.footer-enquiry) { display: inline-flex; align-items: center; gap: 18px; min-height: 44px; border-bottom: 1px solid #b99a77; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; }
        .footer-perspective { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 32px 0; border-top: 1px solid #e3e0da; border-bottom: 1px solid #e3e0da; }
        .footer-perspective > div > span { font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: #8b7554; }
        .footer-perspective p { margin-top: 12px; font-family: var(--font-fraunces), Georgia, serif; font-size: clamp(23px, 2.2vw, 34px); font-weight: 300; line-height: 1.3; letter-spacing: -.025em; }
        .footer-perspective em { color: #8b7554; }
        .footer-perspective button { display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; flex-shrink: 0; }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-top: 24px; font-size: 10px; line-height: 1.8; color: #757575; }
        .footer-bottom > div { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; }
        .footer-bottom :global(a) { color: #555; }
        .footer-introduction { min-height: 32px; color: #555; }
        .footer-introduction:hover { color: #746040; }
        .footer-introduction:focus-visible { outline: 2px solid #8b7554; outline-offset: 4px; }
        .footer-bottom > div > span { color: #888; }
        .footer-inner :global(a:hover) { color: #746040; }
        .meh-reference-footer :global(a:focus-visible), .footer-perspective button:focus-visible { outline: 2px solid #8b7554; outline-offset: 4px; }
        @media (max-width: 1023px) {
          .footer-inner { width: 88%; }
          .footer-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px; }
          .footer-bottom { align-items: flex-start; flex-direction: column; gap: 14px; }
        }
        @media (max-width: 639px) {
          .meh-reference-footer { padding-top: 40px; padding-bottom: 94px; }
          .footer-brand { gap: 24px; }
          .footer-brand :global(.footer-logo) { width: 150px; }
          .footer-columns { gap: 34px 20px; padding: 36px 0; }
          .footer-columns h2 { font-size: 11px; letter-spacing: .08em; }
          .footer-columns nav :global(a), .footer-contact > p, .footer-contact > a { font-size: 11px; }
          .footer-contact > p, .footer-contact > a { gap: 8px; }
          .footer-perspective { align-items: flex-start; flex-direction: column; gap: 18px; padding: 26px 0; }
          .footer-perspective p { font-size: 25px; }
          .footer-perspective em { display: block; margin-top: 4px; }
          .footer-bottom > div { gap: 12px 22px; }
          .footer-bottom > div > span { flex-basis: 100%; }
        }
      `}</style>
    </footer>
  );
}
