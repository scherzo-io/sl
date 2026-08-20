import { defineField, defineType } from "sanity";

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Verified spelling from Cursor's p42 manifest. Never raw OCR.",
    }),
    defineField({
      name: "logo",
      type: "image",
      description: "Artwork is empty until a press-kit file exists. Do not trace or generate.",
    }),
  ],
});
