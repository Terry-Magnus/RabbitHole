-- AlterTable
ALTER TABLE "journey_node" ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "source" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "source" ADD CONSTRAINT "source_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "journey_node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
