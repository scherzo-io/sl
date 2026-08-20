"use client";

import { proofPoints } from "@/lib/copy";
import { useReview } from "./ReviewProvider";

/** Direction B only: operational proof in Pattern C columns (DESIGN §6). */
export function DirectionProofPoints() {
  const { state } = useReview();
  if (state.direction !== "b") return null;
  return (
    <>
      {proofPoints.items.map((item) => (
        <p key={item.id}>{item.text}</p>
      ))}
    </>
  );
}
