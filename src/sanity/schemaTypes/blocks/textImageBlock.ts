import { defineField, defineType } from "sanity";

// Named for its structure (heading/statement on one side, a single image on
// the other), not for any specific case study's content — see Terra Mare's
// "Passage" section, which is just one use of this generic shape.
export const textImageBlockType = defineType({
  name: "textImageBlock",
  title: "Text + Image",
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
      name: "heading",
      title: "Heading",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "plate",
      title: "Image",
      type: "plate",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "eyebrowLabel", media: "plate.image" },
    prepare({ subtitle, media }) {
      return { title: "Text + Image", subtitle, media };
    },
  },
});
