import { defineField, defineType } from "sanity";

export const plateType = defineType({
  name: "plate",
  title: "Plate",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
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
      name: "fig",
      title: "Figure number",
      type: "string",
      description:
        'e.g. "Fig. 01" — leave blank for plates without a figure label (before/after slider states).',
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { label: "label", fig: "fig", media: "image" },
    prepare({ label, fig, media }) {
      return {
        title: label || "Untitled plate",
        subtitle: fig || undefined,
        media,
      };
    },
  },
});
