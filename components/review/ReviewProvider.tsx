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

/**
 * What the tree can actually show right now, resolved on the server: the photography dump and
 * the staged reel are both git-ignored, so either can be absent. The review panel greys out
 * the variants that would render an empty field rather than letting a reviewer pick one and
 * conclude the build is broken.
 */
export type ReviewCapabilities = {
  video: boolean;
  photos: boolean;
};

type ReviewContextValue = {
  state: ReviewState;
  setReview: (patch: Partial<ReviewState>) => void;
  reset: () => void;
  capabilities: ReviewCapabilities;
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
  capabilities = { video: false, photos: false },
  children,
}: {
  initial: ReviewState;
  capabilities?: ReviewCapabilities;
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

  const reset = useCallback(() => {
    persist(REVIEW_DEFAULTS);
    setState({ ...REVIEW_DEFAULTS });
  }, []);

  const value = useMemo(
    () => ({ state, setReview, reset, capabilities }),
    [state, setReview, reset, capabilities],
  );

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReview must be used inside ReviewProvider");
  return ctx;
}
