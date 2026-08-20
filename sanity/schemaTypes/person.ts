import { defineField, defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      type: "string",
      description: "e.g. Chief executive officer. Direct phones do not live here.",
    }),
    defineField({ name: "headshot", type: "image" }),
    defineField({ name: "bio", type: "blockContent" }),
  ],
});
