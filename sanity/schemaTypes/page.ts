import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
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
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "body", type: "blockContent" }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
});
