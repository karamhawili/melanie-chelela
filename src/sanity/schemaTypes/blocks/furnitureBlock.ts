import { defineArrayMember, defineField, defineType } from "sanity";

export const FURNITURE_MAX = 6;

export const furniturePieceType = defineType({
  name: "furniturePiece",
  title: "Furniture piece",
  type: "object",
  fields: [
    defineField({
      name: "index",
      title: "Index",
      type: "string",
      description: 'e.g. "F.01".',
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "Lounge Chair". Shown with the designer on hover.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "designer",
      title: "Designer",
      type: "string",
      description: 'e.g. "Pierre Jeanneret" or "Studio design".',
    }),
    defineField({
      name: "maker",
      title: "Maker / material",
      type: "string",
      description: 'e.g. "Cassina" or "Oak & travertine".',
    }),
    defineField({
      name: "image",
      title: "Photo",
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
  ],
  preview: {
    select: { name: "name", designer: "designer", media: "image" },
    prepare({ name, designer, media }) {
      return { title: name || "Untitled piece", subtitle: designer || undefined, media };
    },
  },
});

export const furnitureBlockType = defineType({
  name: "furnitureBlock",
  title: "Furniture",
  type: "object",
  description: "A wordless, one-screen collage of up to six pieces.",
  fields: [
    defineField({
      name: "pieces",
      title: "Pieces",
      type: "array",
      of: [defineArrayMember({ type: "furniturePiece" })],
      validation: (rule) => rule.required().min(1).max(FURNITURE_MAX),
    }),
  ],
  preview: {
    select: { pieces: "pieces" },
    prepare({ pieces }) {
      const count = Array.isArray(pieces) ? pieces.length : 0;
      return { title: "Furniture", subtitle: `${count} piece${count === 1 ? "" : "s"}` };
    },
  },
});
