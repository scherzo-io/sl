import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "from",
      type: "string",
      description: "Legacy path, including leading slash. Never a live project slug (SKIP rows). Seed is content/copy/redirects.json until Phase F imports these as documents; a from that equals a live path must not publish.",
      validation: (Rule) => Rule.required().regex(/^\//, "Must start with /"),
    }),
    defineField({
      name: "to",
      type: "string",
      description: "Empty when status is 410.",
    }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["301", "410"] },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { from: "from", status: "status", to: "to" },
    prepare: ({ from, status, to }: { from?: string; status?: string; to?: string }) => ({
      title: from ?? "(no path)",
      subtitle: `${status ?? ""} ${to ?? ""}`.trim(),
    }),
  },
});
