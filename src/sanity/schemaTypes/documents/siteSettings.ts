import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "wordmark",
      title: "Wordmark",
      type: "string",
      initialValue: "Melanie Chelela",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer copyright",
      type: "string",
      initialValue: "© 2026 Studio Melanie Chelela",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerCoordinates",
      title: "Footer coordinates",
      type: "string",
      initialValue: "N 33.89° · E 35.50°",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "inquireEmail",
      title: "Inquire email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "inquireAddress",
      title: "Inquire address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectCounterTotal",
      title: "Project counter total",
      type: "number",
      description:
        'The "/ NN" shown in the case-study header counter — flavor text representing a larger unpublished portfolio, not the literal count of published projects.',
      initialValue: 28,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sitePassword",
      title: "Site password",
      type: "string",
      description:
        "What visitors type at the gate to view the site. Changing this and publishing signs everyone out immediately (including you) — re-enter with the new password. Visitors are never shown this value.",
      validation: (rule) => rule.required().min(8),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
