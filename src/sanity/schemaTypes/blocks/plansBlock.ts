import { defineArrayMember, defineField, defineType } from "sanity";

export const plansBlockType = defineType({
  name: "plansBlock",
  title: "Technical Plans",
  type: "object",
  description:
    "1–4 drawings (plans, sections, elevations), uploaded as transparent PNGs or as PDFs. One plan renders large; each extra plan shrinks the set to fit a single row.",
  fields: [
    defineField({
      name: "sectionNumber",
      title: "Section number",
      type: "string",
      description: "Optional — leave blank for an unlabeled set.",
    }),
    defineField({
      name: "eyebrowLabel",
      title: "Eyebrow label",
      type: "string",
      description: 'Optional — e.g. "Technical Drawings". Required if Section number is set.',
    }),
    defineField({
      name: "metaLabel",
      title: "Right-side meta label",
      type: "string",
      description: 'Optional small label on the right, e.g. "1:50" or "Plans & Sections".',
    }),
    defineField({
      name: "plans",
      title: "Plans",
      type: "array",
      description:
        "PNGs with a transparent background, or PDFs — both render the same way. The whole drawing is always shown, nothing is cropped, and a PDF also gets a full-screen viewer.",
      of: [
        defineArrayMember({ type: "plate", title: "Image plan" }),
        defineArrayMember({ type: "pdfPlate", title: "PDF plan" }),
      ],
      validation: (rule) => rule.required().min(1).error("Add at least one plan.").max(4).error("A set holds at most four plans."),
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect ratio",
      type: "string",
      description:
        'Optional width ÷ height for every frame, e.g. "1.4". Leave blank to let each plan use its own proportions — measured from the file for images and PDFs alike.',
    }),
  ],
  preview: {
    select: { subtitle: "eyebrowLabel", plans: "plans", media: "plans.0.image" },
    prepare({ subtitle, plans, media }) {
      const list = Array.isArray(plans) ? plans : [];
      const pdfs = list.filter((plan) => plan?._type === "pdfPlate").length;
      const mix = pdfs ? `${list.length}, ${pdfs} PDF` : `${list.length}`;
      return {
        title: `Technical Plans (${mix})`,
        subtitle: subtitle || undefined,
        // Only an image plan in slot one yields a thumbnail; a PDF has none.
        media,
      };
    },
  },
});
