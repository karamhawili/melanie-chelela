"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Button, Card, Code, Flex, Stack, Text } from "@sanity/ui";
import { CheckmarkIcon, CopyIcon } from "@sanity/icons";
import type { StringInputProps } from "sanity";
import { invitePath } from "@/lib/inviteToken";

// Replaces the plain text input for the guest's token with the full invite
// link and a copy button. Studio is served from the site's own origin
// (/studio), so the link is built from the current origin — no site-URL
// setting to keep in sync.
export function InviteLinkInput(props: StringInputProps) {
  const token = props.value;
  const [copied, setCopied] = useState(false);
  // window only exists in the browser; empty during any server render.
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => ""
  );

  const link = token ? `${origin}${invitePath(token)}` : "";

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [link]);

  if (!token) {
    return (
      <Text size={1} muted>
        The link is generated when the entry is created.
      </Text>
    );
  }

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} border tone="transparent">
        <Flex align="center" gap={3}>
          <Code size={1} style={{ flex: 1, overflowWrap: "anywhere" }}>
            {link}
          </Code>
          <Button
            icon={copied ? CheckmarkIcon : CopyIcon}
            text={copied ? "Copied" : "Copy"}
            mode="ghost"
            fontSize={1}
            padding={2}
            onClick={copy}
          />
        </Flex>
      </Card>
      <Text size={1} muted>
        Send this to the guest. Opening it signs them in — no password to type.
        Turn off “Active” (or let it expire) and publish to sign them out.
      </Text>
    </Stack>
  );
}
