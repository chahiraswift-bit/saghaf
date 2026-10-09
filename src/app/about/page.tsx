import Image from "next/image";
import { dictionaries, getLocale } from "@/lib/i18n";

export default function AboutPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = getLocale(searchParams?.lang);
  const t = dictionaries[locale];

  return (
    <div className="container-shagaf py-10 md:py-16">
      <section className="grid gap-8 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-12">
        <div className="relative min-h-[280px] overflow-hidden rounded-[28px] border border-[--border] bg-[--surface-subtle] shadow-[0_30px_80px_-30px_rgba(31,21,61,0.45)] sm:min-h-[360px] md:min-h-[440px]">
          <Image
            src="/images/academy-campus.webp"
            alt="School campus building"
            fill
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 46vw, 520px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171126]/80 via-[#171126]/10 to-transparent" />
          <p className="absolute bottom-0 p-5 font-display text-xl font-semibold text-white sm:p-7 sm:text-2xl">{t.about.photoCaption}</p>
        </div>
        <div className="max-w-2xl py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-shagaf-600">{t.about.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-shagaf-700 dark:text-shagaf-200 md:text-5xl">{t.about.title}</h1>
          <p className="mt-6 text-base leading-7 text-[--text-muted] md:text-lg md:leading-8">{t.about.intro}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-4">
              <p className="font-display text-2xl font-semibold text-[--text]">+120</p>
              <p className="mt-1 text-sm text-[--text-muted]">Schools</p>
            </div>
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-4">
              <p className="font-display text-2xl font-semibold text-[--text]">+500</p>
              <p className="mt-1 text-sm text-[--text-muted]">Teachers</p>
            </div>
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-4">
              <p className="font-display text-2xl font-semibold text-[--text]">Career</p>
              <p className="mt-1 text-sm text-[--text-muted]">Focused</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        <div className="rounded-[24px] border border-[--border] bg-[--surface] p-5 shadow-card">
          <div className="relative h-52 overflow-hidden rounded-2xl">
            <Image
              src="/images/academy-mentoring.webp"
              alt="Teacher leading a classroom lesson"
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-[--text]">Built around learning by doing</h2>
          <p className="mt-2 text-sm leading-6 text-[--text-muted]">We connect purpose, practice, and opportunity so learners can move from interest into action.</p>
        </div>
        <div className="rounded-[24px] border border-[--border] bg-[--surface] p-5 shadow-card">
          <div className="relative h-52 overflow-hidden rounded-2xl">
            <Image
              src="/images/academy-students.webp"
              alt="Books and learning materials on a school desk"
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-[--text]">Career-first pathways</h2>
          <p className="mt-2 text-sm leading-6 text-[--text-muted]">We help students, schools, and teachers align around skills that matter in the real market.</p>
        </div>
        <div className="rounded-[24px] border border-[--border] bg-[--surface] p-5 shadow-card">
          <div className="relative h-52 overflow-hidden rounded-2xl">
            <Image
              src="/images/academy-graduation.webp"
              alt="Graduate at an academy ceremony"
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-[--text]">Trusted by modern education teams</h2>
          <p className="mt-2 text-sm leading-6 text-[--text-muted]">From private schools to emerging programs, SHAGAF is designed for professional learning ecosystems.</p>
        </div>
      </section>

      <section className="ml-auto mt-12 max-w-3xl border-t border-[--border] pt-7 md:mt-14 md:pt-9">
        <p className="text-base leading-7 text-[--text-muted] md:text-lg md:leading-8">{t.about.body}</p>
        <p className="mt-6 border-l-2 border-gold-500 pl-4 font-display text-lg font-semibold text-[--text]">{t.about.slogan}</p>
      </section>
    </div>
  );
}
