import { defineField, defineType } from "sanity";

export const quotePortraitBlockType = defineType({
  name: "quotePortraitBlock",
  title: "Quote + Portrait",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quoteEmphasis",
      title: "Emphasized phrase",
      type: "string",
      description: "Must be an exact substring of the quote above — rendered in italic gold.",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const quote = (context.parent as { quote?: string } | undefined)?.quote;
          if (value && quote && !quote.includes(value)) {
            return "Must be an exact substring of the quote above";
          }
          return true;
        }),
    }),
    defineField({
      name: "portrait",
      title: "Portrait image",
      type: "plate",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { quote: "quote", media: "portrait.image" },
    prepare({ quote, media }) {
      return {
        title: quote ? `"${String(quote).slice(0, 40)}…"` : "Quote + Portrait",
        subtitle: "Quote + Portrait",
        media,
      };
    },
  },
});
