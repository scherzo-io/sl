import { defineField, defineType } from "sanity";

export const projectCategory = defineType({
  name: "projectCategory",
  title: "Project category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
