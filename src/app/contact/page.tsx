import { dictionaries, getLocale } from "@/lib/i18n";

export default function ContactPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = getLocale(searchParams?.lang);
  const t = dictionaries[locale];

  return (
    <div className="container-shagaf max-w-prose py-16">
      <div className="rounded-[28px] border border-[--border] bg-[--surface] p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
        <h1 className="font-display text-3xl font-semibold text-shagaf-700 dark:text-shagaf-200">{t.contact.title}</h1>
        <p className="mt-6 text-ink-muted">
          {t.contact.intro}
        </p>
        <div className="mt-6 space-y-2 text-[--text]">
          <p>
            {t.contact.email}: <a className="text-shagaf-600 hover:underline" href="mailto:hello@shagaf.app">hello@shagaf.app</a>
          </p>
          <p>{t.contact.location}: {t.contact.city}</p>
        </div>
      </div>
    </div>
  );
}
