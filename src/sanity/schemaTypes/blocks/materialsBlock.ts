import { defineArrayMember, defineField, defineType } from "sanity";

export const MATERIALS_MAX = 6;

export const materialItemType = defineType({
  name: "materialItem",
  title: "Material",
  type: "object",
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      description: 'Spec-sheet reference, e.g. "M.01".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finish",
      title: "Finish & use",
      type: "string",
      description: 'e.g. "Honed · Floors". Shown beneath the swatch, under the code and name.',
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      description:
        'Flat colour for the swatch, e.g. "#d9cdb8" — used when there is no photo. Any CSS colour or gradient works.',
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      description: "Optional close-up of the material; replaces the flat tone.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const v = value as { tone?: string; image?: { asset?: unknown } } | undefined;
      if (!v?.tone && !v?.image?.asset) return "Give the material a tone or a photo.";
      return true;
    }),
  preview: {
    select: { code: "code", name: "name", media: "image" },
    prepare({ code, name, media }) {
      return { title: name || "Untitled material", subtitle: code || undefined, media };
    },
  },
});

export const materialsBlockType = defineType({
  name: "materialsBlock",
  title: "Materials",
  type: "object",
  description: "A one-screen collage of up to six material swatches, each labelled with its code, name and finish.",
  fields: [
    defineField({
      name: "items",
      title: "Materials",
      type: "array",
      of: [defineArrayMember({ type: "materialItem" })],
      validation: (rule) => rule.required().min(1).max(MATERIALS_MAX),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return { title: "Materials", subtitle: `${count} swatch${count === 1 ? "" : "es"}` };
    },
  },
});
