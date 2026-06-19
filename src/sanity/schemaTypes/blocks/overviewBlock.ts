import { defineArrayMember, defineField, defineType } from "sanity";

export const overviewBlockType = defineType({
  name: "overviewBlock",
  title: "Overview",
  type: "object",
  fields: [
    defineField({
      name: "sectionNumber",
      title: "Section number",
      type: "string",
      description: 'e.g. "01"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrowLabel",
      title: "Eyebrow label",
      type: "string",
      initialValue: "The Project",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "facts",
      title: "Facts",
      type: "array",
      of: [defineArrayMember({ type: "fact" })],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "statement",
      title: "Statement",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statementEmphasis",
      title: "Emphasized phrase",
      type: "string",
      description: "Must be an exact substring of the statement above — rendered in italic gold.",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const statement = (context.parent as { statement?: string } | undefined)?.statement;
          if (value && statement && !statement.includes(value)) {
            return "Must be an exact substring of the statement above";
          }
          return true;
        }),
    }),
    defineField({
      name: "body",
      title: "Body paragraph",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "eyebrowLabel" },
    prepare({ subtitle }) {
      return { title: "Overview", subtitle };
    },
  },
});
