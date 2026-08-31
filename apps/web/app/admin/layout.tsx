import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SessionResponse {
  user: { role: "USER" | "ADMIN" };
}

// This project runs the API and web app as separate processes, so — unlike
// a single-Next.js-app Better Auth setup — there's no in-process `auth`
// instance to call here. The incoming request's Cookie header is forwarded
// to the API's own GET /api/auth/get-session instead, the same session
// check AdminGuard performs on the backend, just reached the way this
// split architecture requires. See context/specs/12-authentication.md.
async function requireAdmin(): Promise<void> {
  const cookie = (await headers()).get("cookie") ?? "";

  const response = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie },
    cache: "no-store",
  });

  const session = response.ok ? ((await response.json()) as SessionResponse | null) : null;

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex flex-1">
      <aside className="w-56 shrink-0 border-r border-border p-4">
        <Link href="/admin/journeys" className="font-heading text-h5 font-bold text-primary">
          Rabbit Hole
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          <Link
            href="/admin/journeys"
            className="rounded-md px-3 py-2 text-small font-medium text-foreground hover:bg-surface-hover"
          >
            Journeys
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col p-8">{children}</div>
    </div>
  );
}
