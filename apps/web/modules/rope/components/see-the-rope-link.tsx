"use client";

import { Route } from "lucide-react";

import { useRopeStore } from "../store/use-rope-store";

export function SeeTheRopeLink() {
  const stops = useRopeStore((state) => state.stops);
  const setOpen = useRopeStore((state) => state.setOpen);

  if (stops.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full max-w-xl items-center gap-5 rounded-2xl border border-border bg-white/4 px-6 py-5">
      <Route className="size-5.5 shrink-0 text-violet-300" aria-hidden="true" />
      <p className="flex-1 text-small leading-relaxed text-violet-200">
        Your rope is coiled and saved. Come back and walk any of it again.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-small font-semibold whitespace-nowrap text-violet-300 hover:text-gold-300"
      >
        See the rope
      </button>
    </div>
  );
}
