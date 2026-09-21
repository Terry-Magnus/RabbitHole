-- AlterTable
-- Note: Prisma's auto-generated version of this migration also included
-- `DROP INDEX "journey_search_vector_idx"` and
-- `ALTER TABLE "journey" ALTER COLUMN "searchVector" DROP DEFAULT` — the
-- known tsvector-drift false positive documented in context/project-tracker.md
-- (Unit 10). Both were removed by hand; they would have destroyed the
-- Unit 10 search infrastructure. Unrelated to this migration's actual change.
ALTER TABLE "journey_node" ADD COLUMN "ahaMoment" TEXT;
