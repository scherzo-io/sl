import { defineArrayMember, defineField, defineType } from "sanity";
import { ROLE_ATOMS } from "../../lib/roles";
import { SUBCATEGORIES } from "../../lib/subCategories";

export const project = defineType({
  name: "project",
  title: "Project",
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
      name: "category",
      type: "reference",
      to: [{ type: "projectCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subCategory",
      type: "string",
      options: { list: SUBCATEGORIES.map((v) => ({ title: v, value: v })) },
      description: "PLAN §1 row 14 — list pending Eric. Do not backfill the 55.",
    }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "sizeSqFt", type: "number" }),
    defineField({
      name: "roles",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: ROLE_ATOMS.map((v) => ({ title: v, value: v })) },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          const bad = value.filter((v) => !ROLE_ATOMS.includes(v as (typeof ROLE_ATOMS)[number]));
          return bad.length === 0 || `Unknown role atom: ${bad.join(", ")}`;
        }),
    }),
    defineField({
      name: "roleDetail",
      type: "string",
      description: "Trimmed raw ACF string.",
    }),
    defineField({ name: "designer", type: "string" }),
    defineField({
      name: "architect",
      type: "string",
      description: "Nullable. Empty / None / None Involved → null. Hide the credit line when empty.",
    }),
    defineField({ name: "description", type: "blockContent" }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({
      name: "sourceId",
      type: "number",
      description: "WordPress post ID. Document id is project-<sourceId>.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location" },
  },
});
