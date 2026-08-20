import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "logo", type: "image" }),
    defineField({
      name: "addressLine",
      type: "string",
      initialValue: "483 10th Ave, Suite 205, New York 10018",
    }),
    defineField({
      name: "phone",
      type: "string",
      description: "Pending Eric. Leave empty rather than guessing. Never render an empty field.",
    }),
    defineField({
      name: "email",
      type: "string",
      initialValue: "Eric@StreamlineUSA.com",
    }),
    defineField({
      name: "social",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({ name: "footer", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
