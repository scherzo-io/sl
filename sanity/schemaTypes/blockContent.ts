import { defineArrayMember, defineField, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
      marks: {
        decorators: [{ title: "Emphasis", value: "em" }],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({ scheme: ["http", "https", "mailto"] }),
              }),
            ],
          },
        ],
      },
    }),
  ],
});
