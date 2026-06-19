import { defineField, defineType } from "sanity";

function requireSubstringOf(parentField: string) {
  return (rule: import("sanity").StringRule) =>
    rule.required().custom((value, context) => {
      const parent = context.parent as Record<string, string | undefined> | undefined;
      const source = parent?.[parentField];
      if (value && source && !source.includes(value)) {
        return `Must be an exact substring of ${parentField}`;
      }
      return true;
    });
}

export const worksPageType = defineType({
  name: "worksPage",
  title: "Works Page",
  type: "document",
  fields: [
    defineField({
      name: "mastheadEyebrow",
      title: "Masthead eyebrow",
      type: "string",
      initialValue: "A Selection · 2020 — 2024",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mastheadTitleLine1",
      title: "Masthead title — line 1",
      type: "string",
      initialValue: "Selected",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mastheadTitleLine2",
      title: "Masthead title — line 2 (gold)",
      type: "string",
      initialValue: "Works",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mastheadIntro",
      title: "Masthead intro",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closingEyebrow",
      title: "Closing eyebrow",
      type: "string",
      initialValue: "More on Request",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closingHeading",
      title: "Closing heading",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closingHeadingEmphasis",
      title: "Closing heading — emphasized phrase",
      type: "string",
      description: "Must be an exact substring of the heading above — rendered in italic gold.",
      validation: requireSubstringOf("closingHeading"),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Works Page" };
    },
  },
});
