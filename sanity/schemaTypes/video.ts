import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "youtubeId",
      type: "string",
      description:
        "PLAN §8 shape. If Alexey chooses self-hosting (row 32), this field gets a superseding row — do not invent a file URL here.",
    }),
    defineField({ name: "poster", type: "image" }),
  ],
});
