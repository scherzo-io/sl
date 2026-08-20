import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Yoast is empty on the live site — write titles fresh.",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
    }),
  ],
});
