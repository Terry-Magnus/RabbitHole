"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateSource, useDeleteSource } from "../hooks/use-source-mutations";
import type { Source } from "../types/node";

interface SourceListProps {
  journeyId: string;
  nodeId: string;
  sources: Source[];
}

export function SourceList({ journeyId, nodeId, sources }: SourceListProps) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const createSource = useCreateSource(journeyId, nodeId);
  const deleteSource = useDeleteSource(journeyId, nodeId);

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!label.trim() || !url.trim()) {
      return;
    }

    createSource.mutate(
      { label, url },
      {
        onSuccess: () => {
          setLabel("");
          setUrl("");
        },
      },
    );
  }

  return (
    <div className="space-y-3">
      {sources.length > 0 ? (
        <ul className="space-y-2">
          {sources.map((source) => (
            <li
              key={source.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-foreground hover:underline"
              >
                {source.label}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => deleteSource.mutate(source.id)}
                isLoading={deleteSource.isPending}
                aria-label="Remove source"
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <label className="text-caption text-muted-foreground" htmlFor="source-label">
            Label
          </label>
          <Input
            id="source-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="CDC — Vaccine Basics"
          />
        </div>
        <div className="space-y-1">
          <label className="text-caption text-muted-foreground" htmlFor="source-url">
            URL
          </label>
          <Input
            id="source-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <Button type="submit" size="sm" isLoading={createSource.isPending}>
          Add source
        </Button>
      </form>
    </div>
  );
}
