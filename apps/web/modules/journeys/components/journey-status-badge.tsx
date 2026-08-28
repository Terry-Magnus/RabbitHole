import { Badge } from "@/components/ui/badge";
import type { JourneyStatus } from "../types/journey";

const statusLabels: Record<JourneyStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const statusVariants: Record<JourneyStatus, "secondary" | "default" | "outline"> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
};

export function JourneyStatusBadge({ status }: { status: JourneyStatus }) {
  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}
