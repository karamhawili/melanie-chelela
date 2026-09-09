import { defineArrayMember, defineField, defineType } from "sanity";

export const plansBlockType = defineType({
  name: "plansBlock",
  title: "Technical Plans",
  type: "object",
  description:
    "1–4 transparent PNG drawings (plans, sections, elevations). One plan renders large; each extra plan shrinks the set to fit a single row.",
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
      description: "Upload PNGs with a transparent background. The whole drawing is always shown — nothing is cropped.",
      of: [defineArrayMember({ type: "plate" })],
      validation: (rule) => rule.required().min(1).error("Add at least one plan.").max(4).error("A set holds at most four plans."),
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect ratio",
      type: "string",
      description:
        'Optional width ÷ height for every frame, e.g. "1.4". Leave blank to use a default that depends on how many plans are in the set.',
    }),
  ],
  preview: {
    select: { subtitle: "eyebrowLabel", plans: "plans", media: "plans.0.image" },
    prepare({ subtitle, plans, media }) {
      const count = Array.isArray(plans) ? plans.length : 0;
      return {
        title: `Technical Plans (${count})`,
        subtitle: subtitle || undefined,
        media,
      };
    },
  },
});
