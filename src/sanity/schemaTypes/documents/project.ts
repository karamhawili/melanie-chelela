import { defineArrayMember, defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Typology",
      type: "string",
      description: 'e.g. "Restaurant & Bar"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "area",
      title: "Area",
      type: "string",
      description: 'e.g. "740 m²" — kept as text to preserve the unit suffix.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Controls Selected Work's top-4, the Works index order, and the prev/next pager sequence.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardImage",
      title: "Card image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "cardCaptionFig",
      title: "Card caption — figure",
      type: "string",
      description: 'e.g. "Fig. 01"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardCaptionLabel",
      title: "Card caption — label",
      type: "string",
      description: 'e.g. "Rooftop Terrace"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      description: "Falls back to Title if left blank.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      description: "Falls back to Description if left blank.",
    }),
    defineField({
      name: "pageBuilder",
      title: "Case Study",
      description:
        "Leave empty to show the 'in development' placeholder instead of a full case study.",
      type: "array",
      of: [
        defineArrayMember({ type: "caseStudyHero" }),
        defineArrayMember({ type: "fullBleedImage" }),
        defineArrayMember({ type: "overviewBlock" }),
        defineArrayMember({ type: "beforeAfterBlock" }),
        defineArrayMember({ type: "twoUpImageBlock" }),
        defineArrayMember({ type: "quotePortraitBlock" }),
        defineArrayMember({ type: "textImageBlock" }),
        defineArrayMember({ type: "creditsBlock" }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "tag", media: "cardImage" },
  },
});
