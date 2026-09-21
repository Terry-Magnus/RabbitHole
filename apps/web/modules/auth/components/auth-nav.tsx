"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "../lib/auth-client";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function AuthNav() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  if (!session) {
    return (
      <Button asChild variant="outline" size="sm">
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
    <div className="flex items-center gap-3">
      <Link
        href="/library"
        className="text-small font-medium text-violet-300 transition-colors hover:text-gold-300"
      >
        Library
      </Link>
      <div
        className="flex size-8 items-center justify-center rounded-full border border-violet-300/35 bg-violet-300/16 text-xs font-semibold text-violet-300"
        title={session.user.name}
        aria-hidden="true"
      >
        {initialsOf(session.user.name)}
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-small font-medium text-violet-300 transition-colors hover:text-gold-300"
      >
        Sign out
      </button>
    </div>
  );
}
