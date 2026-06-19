import { defineField, defineType } from "sanity";

export const beforeAfterBlockType = defineType({
  name: "beforeAfterBlock",
  title: "Before / After Slider",
  type: "object",
  fields: [
    defineField({
      name: "sectionNumber",
      title: "Section number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrowLabel",
      title: "Eyebrow label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dragLabel",
      title: "Drag instruction label",
      type: "string",
      initialValue: "Drag — closed / open",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "before",
      title: "Before state",
      type: "plate",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "after",
      title: "After state",
      type: "plate",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: 'e.g. "Fig. 02 / 03"',
    }),
  ],
  preview: {
    select: { subtitle: "eyebrowLabel", media: "before.image" },
    prepare({ subtitle, media }) {
      return { title: "Before / After Slider", subtitle, media };
    },
  },
});
