"use client";

import { useEffect, useState } from "react";
import analytics from "@/content/copy/analytics.json";

export const CONSENT_COOKIE = "sl-consent";

type Consent = "unknown" | "accept" | "decline";

function readCookie(): Consent {
  if (typeof document === "undefined") return "unknown";
  const match = document.cookie.match(/(?:^|; )sl-consent=(accept|decline)/);
  const v = match?.[1];
  return v === "accept" || v === "decline" ? v : "unknown";
}

function persist(value: Exclude<Consent, "unknown">) {
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; SameSite=Lax; Max-Age=31536000`;
}

function injectTags() {
  if (analytics.ga4) {
    /* ID pending — do not invent a measurement ID */
  }
  if (analytics.metaPixel) {
    /* ID pending */
  }
  if (analytics.linkedin) {
    /* ID pending */
  }
}

export function ConsentBanner({ initial }: { initial: Consent }) {
  const [consent, setConsent] = useState<Consent>(initial);

  useEffect(() => {
    if (consent === "unknown") {
      const fromCookie = readCookie();
      if (fromCookie !== "unknown") setConsent(fromCookie);
    }
  }, [consent]);

  useEffect(() => {
    if (consent === "accept") injectTags();
  }, [consent]);

  if (consent !== "unknown") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red bg-paper px-4 py-3">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <p className="font-display text-sm font-light text-ink">Analytics</p>
        <button
          type="button"
          className="font-display text-sm font-light text-red"
          onClick={() => {
            persist("accept");
            setConsent("accept");
          }}
        >
          Accept
        </button>
        <button
          type="button"
          className="font-display text-sm font-light text-ink-soft"
          onClick={() => {
            persist("decline");
            setConsent("decline");
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
