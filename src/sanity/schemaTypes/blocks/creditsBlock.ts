import { defineArrayMember, defineField, defineType } from "sanity";

export const creditsBlockType = defineType({
  name: "creditsBlock",
  title: "Credits",
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
      initialValue: "Project Credits",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      of: [defineArrayMember({ type: "fact" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Credits" };
    },
  },
});
