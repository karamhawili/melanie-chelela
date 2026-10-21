import { defineField, defineType } from "sanity";

export const TITLE_LINE_STYLES = [
  { title: "Upright", value: "regular" },
  { title: "Italic", value: "italic" },
  { title: "Gold", value: "gold" },
  { title: "Gold italic", value: "goldItalic" },
] as const;

export type TitleLineStyle = (typeof TITLE_LINE_STYLES)[number]["value"];

export const TITLE_LINE_SIZES = [
  { title: "Small", value: "small" },
  { title: "Regular", value: "regular" },
  { title: "Large", value: "large" },
] as const;

export type TitleLineSize = (typeof TITLE_LINE_SIZES)[number]["value"];

/**
 * One line of a project's display title. Lines carry their text, voice
 * (upright / italic / gold) and a relative size; every surface that sets the
 * title — the hero, the Works index, the home cards, the pager — keeps its
 * own base size, which Small and Large scale from.
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
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description: "Relative to the surface: Small is about two-thirds of the line next to it, Large about a third bigger.",
      initialValue: "regular",
      options: { list: [...TITLE_LINE_SIZES], layout: "radio", direction: "horizontal" },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { text: "text", style: "style", size: "size" },
    prepare({ text, style, size }) {
      const notes = [
        TITLE_LINE_STYLES.find((s) => s.value === style)?.title,
        TITLE_LINE_SIZES.find((s) => s.value === size)?.title,
      ].filter((label) => label && label !== "Upright" && label !== "Regular");
      return { title: text || "—", subtitle: notes.length > 0 ? notes.join(" · ") : undefined };
    },
  },
});
