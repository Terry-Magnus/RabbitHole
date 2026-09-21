import { Search } from "lucide-react";
import Form from "next/form";

import { Input } from "@/components/ui/input";

export function SearchInput() {
  return (
    <Form action="/search" className="relative w-full max-w-56">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <Input
        type="search"
        name="q"
        placeholder="Ask anything…"
        aria-label="Search Rabbit Hole"
        className="rounded-full border-border bg-white/5 pl-9 placeholder:text-ink-muted focus-visible:border-violet-300/60 focus-visible:ring-violet-300/30"
      />
    </Form>
  );
}
