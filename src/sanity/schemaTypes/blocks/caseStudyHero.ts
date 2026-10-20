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
    // The hero sets the project's Display title. These two fields are the
    // pre-Display-title way of breaking the name and stay as a fallback for
    // projects that haven't filled it in yet.
    defineField({
      name: "titleLine1",
      title: "Title — line 1",
      type: "string",
      deprecated: { reason: "Set the name on the project's Display title field instead." },
      hidden: ({ value }) => !value,
    }),
    defineField({
      name: "titleLine2",
      title: "Title — line 2 (gold)",
      type: "string",
      deprecated: { reason: "Set the name on the project's Display title field instead." },
      hidden: ({ value }) => !value,
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
    select: { eyebrow: "eyebrow" },
    prepare({ eyebrow }) {
      return { title: "Case Study Hero", subtitle: eyebrow || undefined };
    },
  },
});
