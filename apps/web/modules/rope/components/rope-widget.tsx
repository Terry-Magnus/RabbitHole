"use client";

import { Route } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRopeStore } from "../store/use-rope-store";

export function RopeWidget() {
  const stops = useRopeStore((state) => state.stops);

  if (stops.length === 0) {
    return null;
  }

  const orderedStops = [...stops].reverse();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon-lg"
          className="fixed right-6 bottom-6 z-20 size-14 rounded-full shadow-lg"
          aria-label={`Open your Rope — ${stops.length} ${stops.length === 1 ? "stop" : "stops"}`}
        >
          <Route className="size-5" />
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-discovery text-caption font-medium text-foreground tabular-nums">
            {stops.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Rope</SheetTitle>
        </SheetHeader>
        <ul className="space-y-2 overflow-y-auto px-4">
          {orderedStops.map((stop) => (
            <li key={stop.id}>
              <Link
                href={`/journeys/${stop.journeySlug}/${stop.nodePosition}`}
                className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-discovery"
              >
                <p className="text-body font-medium text-foreground">{stop.nodeTitle}</p>
                <p className="text-caption text-muted-foreground">{stop.journeyTitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
