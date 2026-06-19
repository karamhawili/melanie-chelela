import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

// Configured as a Sanity webhook (manage.sanity.io -> project -> API ->
// Webhooks) pointing at this route's deployed URL, sharing the same secret
// as SANITY_REVALIDATE_SECRET below. Fires on publish; not used in local
// dev since Sanity can't reach localhost.

interface WebhookPayload {
  _type: string;
  slug?: { current?: string };
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    if (!body?._type) {
      return new Response("Bad Request: missing _type", { status: 400 });
    }

    switch (body._type) {
      case "project":
        revalidatePath("/");
        revalidatePath("/works");
        if (body.slug?.current) {
          revalidatePath(`/works/${body.slug.current}`);
        }
        break;
      case "homePage":
        revalidatePath("/");
        break;
      case "worksPage":
        revalidatePath("/works");
        break;
      case "siteSettings":
        // Header/Footer render on every page — invalidate the whole site.
        revalidatePath("/", "layout");
        break;
      default:
        break;
    }

    return Response.json({ revalidated: true, type: body._type, now: Date.now() });
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
}
