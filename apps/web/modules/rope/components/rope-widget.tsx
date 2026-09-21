"use client";

import { Route, X } from "lucide-react";
import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useRopeStore } from "../store/use-rope-store";

export function RopeWidget() {
  const stops = useRopeStore((state) => state.stops);
  const isOpen = useRopeStore((state) => state.isOpen);
  const setOpen = useRopeStore((state) => state.setOpen);
  const isMobile = useIsMobile();

  if (stops.length === 0) {
    return null;
  }

  const orderedStops = [...stops].reverse();
  const lastStop = orderedStops[0];

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {/* Desktop: a wide labeled pill. Mobile: a 52px square so it clears
          the minimum touch target without eating thumb-reachable width
          next to the reading page's own bottom bar. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-20 flex size-13 items-center justify-center rounded-full border border-gold-300/45 bg-night-700/85 text-white shadow-[0_14px_40px_rgba(10,4,30,0.7)] transition-transform duration-200 ease-out hover-fine:hover:-translate-y-0.75 sm:right-8 sm:bottom-8 sm:size-auto sm:justify-start sm:gap-3 sm:py-3.5 sm:pr-6 sm:pl-4.5 hover-fine:sm:hover:border-gold-300"
        aria-label={`Open your Rope — ${stops.length} ${stops.length === 1 ? "stop" : "stops"}`}
      >
        <Route className="size-4.5 text-gold-300" aria-hidden="true" />
        <span className="hidden text-small font-semibold sm:inline">The rope</span>
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-violet-900 sm:static sm:px-2.5 sm:py-0.5 sm:text-caption">
          {stops.length}
        </span>
      </button>

      <SheetContent
        side={isMobile ? "bottom" : "right"}
        showCloseButton={false}
        className="flex max-h-[78vh] w-full gap-0 border-gold-300/28 bg-gradient-to-b from-night-500 to-night-600 p-0 text-parchment shadow-panel sm:max-h-none sm:w-[440px] sm:max-w-[440px] sm:border-l"
      >
        {/* Grab handle — mobile (bottom sheet) only. */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1 w-10.5 rounded-full bg-violet-300/40" />
        </div>

        <SheetHeader className="flex-row items-start justify-between gap-4 space-y-0 px-7 pt-5 pb-5 sm:pt-8">
          <div className="space-y-1.5">
            <SheetTitle className="font-serif text-[1.875rem] font-normal text-white">
              The rope
            </SheetTitle>
            <p className="text-small text-violet-200">
              Every place you&apos;ve been, still warm. Tug on any of it.
            </p>
          </div>
          <SheetClose className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-border-strong transition-colors hover:bg-surface-hover">
            <X className="size-3.5 text-violet-300" aria-hidden="true" />
          </SheetClose>
        </SheetHeader>

        <ul className="flex-1 space-y-0 overflow-y-auto px-7 pb-6">
          {orderedStops.map((stop, index) => {
            const isMostRecent = index === 0;
            return (
              <li key={stop.id} className="flex gap-3.5">
                <div className="flex w-4 flex-col items-center pt-1.5">
                  <span
                    className={
                      isMostRecent
                        ? "size-2.75 shrink-0 rounded-full bg-gold-500 shadow-[0_0_0_5px_rgba(244,180,0,0.2)]"
                        : "size-2.75 shrink-0 rounded-full bg-violet-400"
                    }
                  />
                  {index < orderedStops.length - 1 ? (
                    <span className="w-0.5 flex-1 bg-violet-400/40" />
                  ) : null}
                </div>
                <Link
                  href={`/journeys/${stop.journeySlug}/${stop.nodePosition}`}
                  className="flex-1 py-2 pb-5.5"
                >
                  <p
                    className={
                      isMostRecent
                        ? "font-mono text-[10px] tracking-[0.14em] text-gold-300 uppercase"
                        : "font-mono text-[10px] tracking-[0.14em] text-ink-muted uppercase"
                    }
                  >
                    {isMostRecent ? "You stepped off here" : stop.journeyTitle}
                  </p>
                  <p
                    className={
                      isMostRecent
                        ? "mt-1.5 rounded-xl border border-gold-300/45 bg-gold-500/12 px-4 py-3 text-small text-white"
                        : "mt-1.5 text-small text-violet-200"
                    }
                  >
                    {stop.nodeTitle}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        {lastStop ? (
          <div className="flex flex-col gap-2.5 border-t border-border px-7 pt-4.5 pb-7">
            <Link
              href={`/journeys/${lastStop.journeySlug}/${lastStop.nodePosition}`}
              onClick={() => setOpen(false)}
              className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-violet-400 to-violet-500 py-3.5 text-small font-semibold text-white"
            >
              Back to &ldquo;{lastStop.journeyTitle}&rdquo;
            </Link>
            <p className="text-center text-caption text-ink-muted">
              Nothing you&apos;ve walked is ever lost.
            </p>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
