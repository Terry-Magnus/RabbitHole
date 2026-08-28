import { SearchInput } from "@/modules/search/components/search-input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <span className="font-heading text-h5 font-bold text-primary">
          Rabbit Hole
        </span>
        <SearchInput />
      </div>
    </header>
  );
}
