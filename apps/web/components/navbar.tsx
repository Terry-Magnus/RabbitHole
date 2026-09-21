import Link from "next/link";

import { AuthNav } from "@/modules/auth/components/auth-nav";
import { SearchInput } from "@/modules/search/components/search-input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-night-700/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="size-6.5 shrink-0 animate-lantern rounded-full bg-[radial-gradient(circle_at_32%_30%,#FFE08A,#F4B400_55%,#B37400)]"
            aria-hidden="true"
          />
          <span className="font-serif text-xl text-parchment">Rabbit Hole</span>
        </Link>
        <div className="flex items-center gap-4">
          <SearchInput />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
