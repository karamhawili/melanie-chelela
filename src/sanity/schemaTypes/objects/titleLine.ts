import { defineField, defineType } from "sanity";

export const TITLE_LINE_STYLES = [
  { title: "Upright", value: "regular" },
  { title: "Italic", value: "italic" },
  { title: "Gold", value: "gold" },
  { title: "Gold italic", value: "goldItalic" },
] as const;

export type TitleLineStyle = (typeof TITLE_LINE_STYLES)[number]["value"];

/**
 * One line of a project's display title. Lines carry only their text and
 * voice (upright / italic / gold); every surface that sets the title — the
 * hero, the Works index, the home cards, the pager — keeps its own size.
 */
export const titleLineType = defineType({
  name: "titleLine",
  title: "Title line",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "regular",
      options: { list: [...TITLE_LINE_STYLES], layout: "radio", direction: "horizontal" },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { text: "text", style: "style" },
    prepare({ text, style }) {
      const label = TITLE_LINE_STYLES.find((s) => s.value === style)?.title;
      return { title: text || "—", subtitle: label && label !== "Upright" ? label : undefined };
    },
  },
});
