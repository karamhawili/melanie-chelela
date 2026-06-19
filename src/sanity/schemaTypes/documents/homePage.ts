import { defineArrayMember, defineField, defineType } from "sanity";

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

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "string",
      initialValue: "Interior Architecture",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitleLine1",
      title: "Hero title — line 1",
      type: "string",
      initialValue: "Melanie",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitleLine2",
      title: "Hero title — line 2 (gold)",
      type: "string",
      initialValue: "Chlela",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroMetaLeft",
      title: "Hero meta — left",
      type: "string",
      initialValue: "Est. Beirut",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroMetaRight",
      title: "Hero meta — right",
      type: "string",
      initialValue: "Since 2009",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "wallDividerText",
      title: "Wall divider text",
      type: "string",
      initialValue: "Interiors, Drawn to the Millimetre",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "philosophyHeading",
      title: "Philosophy heading",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "philosophyHeadingEmphasis",
      title: "Philosophy heading — emphasized phrase",
      type: "string",
      description: "Must be an exact substring of the heading above — rendered in italic gold.",
      validation: requireSubstringOf("philosophyHeading"),
    }),
    defineField({
      name: "philosophyParagraph1",
      title: "Philosophy paragraph 1",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "philosophyParagraph2",
      title: "Philosophy paragraph 2",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "selectedWorkCount",
      title: "Selected Work — number of projects shown",
      type: "number",
      initialValue: 4,
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: "services",
      title: "Approach — services",
      type: "array",
      of: [defineArrayMember({ type: "serviceItem" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "inquireHeading",
      title: "Inquire heading",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "inquireHeadingEmphasis",
      title: "Inquire heading — emphasized phrase",
      type: "string",
      description: "Must be an exact substring of the heading above — rendered in italic gold.",
      validation: requireSubstringOf("inquireHeading"),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
