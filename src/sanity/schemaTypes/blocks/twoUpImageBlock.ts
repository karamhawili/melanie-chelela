import { defineField, defineType } from "sanity";

export const twoUpImageBlockType = defineType({
  name: "twoUpImageBlock",
  title: "Two-Up Image Duo",
  type: "object",
  fields: [
    defineField({
      name: "sectionNumber",
      title: "Section number",
      type: "string",
      description: "Optional — leave blank for an unlabeled duo (e.g. today's Details section).",
    }),
    defineField({
      name: "eyebrowLabel",
      title: "Eyebrow label",
      type: "string",
      description: "Optional — required if Section number is set.",
    }),
    defineField({
      name: "metaLabel",
      title: "Right-side meta label",
      type: "string",
      description: 'Optional small label on the right, e.g. "Day / Dusk".',
    }),
    defineField({
      name: "left",
      title: "Left image",
      type: "plate",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "right",
      title: "Right image",
      type: "plate",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leftAspectRatio",
      title: "Left aspect ratio",
      type: "string",
      description: 'e.g. "1.438" — leave blank to use the component default.',
    }),
    defineField({
      name: "rightAspectRatio",
      title: "Right aspect ratio",
      type: "string",
      description: "Leave blank to match the left image's ratio.",
    }),
  ],
  preview: {
    select: { subtitle: "eyebrowLabel", media: "left.image" },
    prepare({ subtitle, media }) {
      return { title: "Two-Up Image Duo", subtitle: subtitle || undefined, media };
    },
  },
});
