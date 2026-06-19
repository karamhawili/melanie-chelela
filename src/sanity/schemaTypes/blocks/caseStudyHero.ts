import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudyHeroType = defineType({
  name: "caseStudyHero",
  title: "Case Study Hero",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleLine1",
      title: "Title — line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleLine2",
      title: "Title — line 2 (gold)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "facts",
      title: "Facts",
      type: "array",
      of: [defineArrayMember({ type: "fact" })],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: { line1: "titleLine1", line2: "titleLine2" },
    prepare({ line1, line2 }) {
      return { title: `${line1 ?? ""} ${line2 ?? ""}`.trim() || "Case Study Hero", subtitle: "Case Study Hero" };
    },
  },
});
