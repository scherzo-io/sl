import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 6, validation: (Rule) => Rule.required() }),
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({
      name: "project",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "published",
      type: "boolean",
      initialValue: true,
      description: "Mercer St Loft Owners stays unpublished until Eric (conflict A-18).",
    }),
  ],
  preview: { select: { title: "name", subtitle: "company" } },
});
