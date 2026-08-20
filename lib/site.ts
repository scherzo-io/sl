/**
 * Facts that may render. Each traces to PLAN / DESIGN / a live page extract.
 * Phone is pending Eric (Phase A item 8) — do not put a number here.
 * Social profiles were not in the export chrome — do not invent them.
 */
export const site = {
  name: "Streamline USA",
  legalName: "Streamline USA LLC",
  wordmark: "Streamline",
  email: "Eric@StreamlineUSA.com",
  address: {
    line: "483 10th Ave, Suite 205, New York 10018",
    street: "483 10th Ave",
    suite: "Suite 205",
    city: "New York",
    region: "NY",
    postal: "10018",
  },
} as const;
