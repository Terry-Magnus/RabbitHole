import { BookOpen } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { fetchBookmarks } from "@/modules/bookmarks/services/bookmarks-api";
import { JourneyCard } from "@/modules/journeys/components/journey-card";
import { ProgressJourneyCard } from "@/modules/progress/components/progress-journey-card";
import { fetchLibrary } from "@/modules/progress/services/progress-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SessionResponse {
  user: { role: "USER" | "ADMIN" };
}

// Any signed-in user, no role check — same cookie-forwarding pattern
// app/admin/layout.tsx uses for requireAdmin(), just without the role
// branch (see context/specs/13-learning-progress.md).
async function requireSession(): Promise<void> {
  const cookie = (await headers()).get("cookie") ?? "";

  const response = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie },
    cache: "no-store",
  });

  const session = response.ok ? ((await response.json()) as SessionResponse | null) : null;

  if (!session) {
    redirect("/login");
  }
}

export default async function LibraryPage() {
  await requireSession();

  const cookie = (await headers()).get("cookie") ?? "";
  const [items, bookmarks] = await Promise.all([fetchLibrary(cookie), fetchBookmarks(cookie)]);
  const inProgress = items.filter((item) => !item.completed);
  const completed = items.filter((item) => item.completed);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10">
      <h1 className="font-serif text-section-head text-parchment">Your library</h1>

      {items.length === 0 && bookmarks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="You haven't started or bookmarked a journey yet"
          description="Open a trail from the homepage to see it here."
        />
      ) : (
        <div className="flex flex-col gap-10">
          {inProgress.length > 0 ? (
            <section className="flex flex-col gap-5">
              <h2 className="font-serif text-section-head text-parchment">In progress</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {inProgress.map((item) => (
                  <ProgressJourneyCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {completed.length > 0 ? (
            <section className="flex flex-col gap-5">
              <h2 className="font-serif text-section-head text-parchment">Completed</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {completed.map((item) => (
                  <ProgressJourneyCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {bookmarks.length > 0 ? (
            <section className="flex flex-col gap-5">
              <h2 className="font-serif text-section-head text-parchment">Bookmarked</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((journey) => (
                  <JourneyCard key={journey.id} {...journey} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
