"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { SidebarChrome } from "./Sidebar";

export function MobileBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-red bg-sidebar px-4 lg:hidden">
        <Link href="/" className="font-display text-md font-light text-red">
          {site.wordmark}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center"
        >
          <span className="flex h-3 w-5 flex-col justify-between" aria-hidden="true">
            <span className="block h-px w-full bg-red" />
            <span className="block h-px w-full bg-red" />
            <span className="block h-px w-full bg-red" />
          </span>
        </button>
      </header>

      {open ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 bg-sidebar lg:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-3 flex h-11 w-11 items-center justify-center font-display text-lg text-red-on-dark"
          >
            ×
          </button>
          <SidebarChrome onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
