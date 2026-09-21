"use client";

import { useState } from "react";

import type { Source } from "../types/node";

interface NodeSourcesProps {
  sources: Source[];
}

export function NodeSources({ sources }: NodeSourcesProps) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border pt-4.5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="font-mono text-kicker tracking-[0.12em] text-ink-muted uppercase"
      >
        {open ? "Hide " : ""}Where this comes from · {sources.length}
      </button>
      {open ? (
        <ul className="animate-rise mt-3 flex flex-col gap-2.5">
          {sources.map((source) => (
            <li key={source.id} className="flex gap-2.5 text-small leading-relaxed text-violet-200">
              <span className="text-gold-300">·</span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-300"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
