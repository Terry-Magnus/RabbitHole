-- AlterTable
-- A generated, stored column, not a plain one: Postgres recomputes it
-- automatically on every INSERT/UPDATE to title or description, so there is
-- no separate "search indexing" step for the application to run.
-- Title is weighted 'A' (higher) over description's 'B' — a title match
-- should outrank a description-only match for the same term.
ALTER TABLE "journey" ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("description", '')), 'B')
  ) STORED;

-- GIN index for fast @@ containment/rank queries against searchVector.
CREATE INDEX "journey_search_vector_idx" ON "journey" USING GIN ("searchVector");
