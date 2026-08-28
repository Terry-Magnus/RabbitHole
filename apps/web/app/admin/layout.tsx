import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
