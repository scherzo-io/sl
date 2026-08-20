import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Deck p3 order: 1 GC · 2 CM · 3 Design Build · 4 Millwork · 5 Carpentry · 6 Pre-construction.",
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({ name: "body", type: "blockContent" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "order" } },
});
