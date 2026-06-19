import { defineField, defineType } from "sanity";

export const serviceItemType = defineType({
  name: "serviceItem",
  title: "Service",
  type: "object",
  fields: [
    defineField({
      name: "letter",
      title: "Letter",
      type: "string",
      description: 'Single letter, e.g. "A"',
      validation: (rule) => rule.required().max(2),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { letter: "letter", title: "title" },
    prepare({ letter, title }) {
      return { title: `${letter}. ${title}` };
    },
  },
});
