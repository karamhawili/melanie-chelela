import { defineField, defineType } from "sanity";

export const fullBleedImageType = defineType({
  name: "fullBleedImage",
  title: "Full-Bleed Image",
  type: "object",
  fields: [
    defineField({
      name: "plate",
      title: "Image",
      type: "plate",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "height",
      title: "Height",
      type: "string",
      description:
        'CSS clamp(), e.g. "clamp(440px, 92vh, 1040px)" — leave blank to use the component default.',
    }),
  ],
  preview: {
    select: { label: "plate.label", media: "plate.image" },
    prepare({ label, media }) {
      return { title: label || "Full-Bleed Image", subtitle: "Full-Bleed Image", media };
    },
  },
});
