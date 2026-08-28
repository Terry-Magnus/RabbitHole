import { Search } from "lucide-react";
import Form from "next/form";

import { Input } from "@/components/ui/input";

export function SearchInput() {
  return (
    <Form action="/search" className="relative w-full max-w-56">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        name="q"
        placeholder="Search journeys…"
        aria-label="Search Rabbit Hole"
        className="pl-8"
      />
    </Form>
  );
}
