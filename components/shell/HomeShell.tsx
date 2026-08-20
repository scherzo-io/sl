"use client";

import type { ReactNode } from "react";
import { useReview } from "@/components/review/ReviewProvider";
import { VIDEO_HOME } from "@/lib/review";
import { Shell } from "./Shell";

export function HomeShell({ children }: { children: ReactNode }) {
  const { state } = useReview();
  const locked = state.direction !== "c" && state.home !== "video-scroll";
  return <Shell scroll={locked ? "none" : "pane"}>{children}</Shell>;
}
