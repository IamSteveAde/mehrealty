export default function PhilosophySection() {
  return (
    <section className="bg-[#f4efe8] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr] lg:items-end">
          <div>
            <p className="eyebrow text-gold">Our philosophy</p>
            <h2 className="mt-5 max-w-lg font-[family-name:var(--font-fraunces)] text-[clamp(2.2rem,4.2vw,4.8rem)] font-light leading-[1.08] tracking-[-0.045em] text-[#171714]">
              Thoughtful properties. Lasting value.
            </h2>
          </div>

          <p className="max-w-2xl text-[15px] leading-8 text-[#1d1b18]/70 sm:text-[17px]">
            MEH Realty is guided by disciplined selection, design-led development,
            and a deep understanding of how people live, invest, and build long-term
            security through real estate.
          </p>
        </div>
      </div>
    </section>
  );
}
