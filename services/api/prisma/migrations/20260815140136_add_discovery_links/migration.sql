-- CreateTable
CREATE TABLE "discovery_link" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "targetJourneyId" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discovery_link_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "discovery_link" ADD CONSTRAINT "discovery_link_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "journey_node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovery_link" ADD CONSTRAINT "discovery_link_targetJourneyId_fkey" FOREIGN KEY ("targetJourneyId") REFERENCES "journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
