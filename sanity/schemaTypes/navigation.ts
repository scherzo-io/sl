import { defineArrayMember, defineField, defineType } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "navItem",
          fields: [
            defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "href", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "children",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "navChild",
                  fields: [
                    defineField({ name: "label", type: "string" }),
                    defineField({ name: "href", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});
