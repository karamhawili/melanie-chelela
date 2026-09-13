import { defineField, defineType } from "sanity";

// The PDF sibling of `plate`. Carries the same caption fields so a plans
// row can mix uploaded drawings and uploaded documents without the
// front-end (or the reader) telling them apart: the first page is
// rasterised into the frame exactly where an <Image> would go.
export const pdfPlateType = defineType({
  name: "pdfPlate",
  title: "PDF plate",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "PDF",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (rule) =>
        rule.required().custom((value?: { asset?: { _ref?: string } }) => {
          const ref = value?.asset?._ref;
          if (!ref || ref.endsWith("-pdf")) return true;
          return "Upload a PDF — other file types can't be drawn into the frame.";
        }),
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describes the drawing for screen readers, as an image's alt text would.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fig",
      title: "Figure number",
      type: "string",
      description: 'e.g. "Fig. 01" — leave blank for a plate without a figure label.',
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect ratio",
      type: "string",
      description:
        'Optional width ÷ height, e.g. "1.414" for A-series landscape. A PDF carries no dimensions in Sanity, so without this the frame opens at the set default and settles to the page\'s real shape once it is drawn.',
    }),
  ],
  preview: {
    select: { label: "label", fig: "fig", filename: "file.asset.originalFilename" },
    prepare({ label, fig, filename }) {
      return {
        title: label || filename || "Untitled PDF plate",
        subtitle: [fig, "PDF"].filter(Boolean).join(" · "),
      };
    },
  },
});
