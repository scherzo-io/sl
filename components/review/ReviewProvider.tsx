"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  REVIEW_COOKIE,
  REVIEW_DEFAULTS,
  parseReview,
  reviewFromSearchParams,
  serializeReview,
  type ReviewState,
} from "@/lib/review";

type ReviewContextValue = {
  state: ReviewState;
  setReview: (patch: Partial<ReviewState>) => void;
};

const ReviewContext = createContext<ReviewContextValue | null>(null);

function persist(state: ReviewState) {
  const value = serializeReview(state);
  document.cookie = `${REVIEW_COOKIE}=${value}; Path=/; SameSite=Lax; Max-Age=31536000`;
  try {
    localStorage.setItem(REVIEW_COOKIE, value);
  } catch {
    /* private mode */
  }
}

export function ReviewProvider({
  initial,
  children,
}: {
  initial: ReviewState;
  children: ReactNode;
}) {
  const [state, setState] = useState<ReviewState>(initial);

  useEffect(() => {
    const patch = reviewFromSearchParams(new URLSearchParams(window.location.search));
    if (patch) {
      setState((prev) => {
        const next = { ...prev, ...patch };
        persist(next);
        return next;
      });
      return;
    }
    if (serializeReview(initial) !== serializeReview(REVIEW_DEFAULTS)) return;
    try {
      const stored = localStorage.getItem(REVIEW_COOKIE);
      if (!stored) return;
      const fromStorage = parseReview(stored);
      persist(fromStorage);
      setState(fromStorage);
    } catch {
      /* ignore */
    }
  }, [initial]);

  useEffect(() => {
    document.documentElement.dataset.direction = state.direction;
  }, [state.direction]);

  const setReview = useCallback((patch: Partial<ReviewState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ state, setReview }), [state, setReview]);

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReview must be used inside ReviewProvider");
  return ctx;
}
