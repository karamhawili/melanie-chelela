import { defineField, defineType } from "sanity";

export const factType = defineType({
  name: "fact",
  title: "Fact",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accent",
      title: "Gold accent",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label", value: "value" },
    prepare({ label, value }) {
      return { title: `${label}: ${value}` };
    },
  },
});
