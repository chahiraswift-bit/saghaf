"use client";

import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";

const locales = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
] as const;

export function LanguageSwitcher() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("lang");
    const stored = window.localStorage.getItem("shagaf-lang");
    const next = fromUrl || stored || "en";

    setLocale(next);
    document.documentElement.lang = next === "ar" ? "ar" : next === "fr" ? "fr" : "en";
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }, []);

  const applyLocale = (next: string) => {
    const url = new URL(window.location.href);

    if (next === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", next);
    }

    window.localStorage.setItem("shagaf-lang", next);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    setLocale(next);
    document.documentElement.lang = next === "ar" ? "ar" : next === "fr" ? "fr" : "en";
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    window.location.reload();
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[--border] bg-[--surface-subtle] p-1 shadow-sm">
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => applyLocale(item.code)}
          className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] transition ${
            locale === item.code
              ? "bg-[--surface] text-[--text] shadow-sm"
              : "text-[--text-muted] hover:text-[--text]"
          }`}
          aria-label={`Switch language to ${item.label}`}
        >
          {item.label}
        </button>
      ))}
      <span className="ml-1 mr-1 hidden text-[--text-muted] md:inline-flex">
        <Globe2 size={14} />
      </span>
    </div>
  );
}
