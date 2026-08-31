"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "../lib/auth-client";

export function AuthNav() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  if (!session) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-small text-muted-foreground">{session.user.name}</span>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
