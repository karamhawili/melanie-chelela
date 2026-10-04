import { defineField, defineType } from "sanity";
import { generateInviteToken, INVITE_TOKEN_PATTERN } from "@/lib/inviteToken";
import { InviteLinkInput } from "../../components/InviteLinkInput";

const DEFAULT_VALIDITY_DAYS = 14;

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// One document per person the owner shares the site with. Opening the
// entry's invite link signs that person in; switching the entry off (or
// letting it expire) and publishing signs them out. See src/lib/siteAccess.ts.
export const guestAccessType = defineType({
  name: "guestAccess",
  title: "Guest access",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Who is this for?",
      type: "string",
      description: "Only shown here, never in the link — e.g. “Jane, Acme”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "token",
      title: "Invite link",
      type: "string",
      readOnly: true,
      initialValue: () => generateInviteToken(),
      validation: (rule) => rule.required().regex(INVITE_TOKEN_PATTERN, { name: "invite code" }),
      components: { input: InviteLinkInput },
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Turn off and publish to sign this guest out immediately.",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "expiresAt",
      title: "Expires",
      type: "datetime",
      description: "The link stops working at this time. Clear it for open-ended access.",
      initialValue: () =>
        new Date(Date.now() + DEFAULT_VALIDITY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      options: { dateFormat: "D MMM YYYY", timeFormat: "HH:mm" },
    }),
    defineField({
      name: "firstViewedAt",
      title: "First opened",
      type: "datetime",
      readOnly: true,
      description: "Set automatically the first time the link is opened.",
    }),
    defineField({
      name: "lastViewedAt",
      title: "Last opened",
      type: "datetime",
      readOnly: true,
      description: "Updated automatically each time the link is opened.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      label: "label",
      active: "active",
      expiresAt: "expiresAt",
      lastViewedAt: "lastViewedAt",
    },
    prepare({ label, active, expiresAt, lastViewedAt }) {
      const expired = Boolean(expiresAt) && new Date(expiresAt).getTime() < Date.now();
      const status = !active
        ? "Revoked"
        : expired
          ? `Expired ${formatDay(expiresAt)}`
          : expiresAt
            ? `Active · expires ${formatDay(expiresAt)}`
            : "Active · no expiry";
      const viewed = lastViewedAt ? ` · last opened ${formatDay(lastViewedAt)}` : " · not opened yet";
      return { title: label || "Untitled guest", subtitle: status + viewed };
    },
  },
});
