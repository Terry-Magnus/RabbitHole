-- AlterTable
ALTER TABLE "journey" DROP COLUMN "estimatedMinutes";

-- CreateTable
CREATE TABLE "journey_node" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_node_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "journey_node_journeyId_order_key" ON "journey_node"("journeyId", "order");

-- AddForeignKey
ALTER TABLE "journey_node" ADD CONSTRAINT "journey_node_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

