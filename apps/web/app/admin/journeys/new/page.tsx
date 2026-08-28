"use client";

import { useRouter } from "next/navigation";

import {
  JourneyForm,
  type JourneyFormValues,
} from "@/modules/journeys/components/journey-form";
import { useCreateJourney } from "@/modules/journeys/hooks/use-journey-mutations";
import Image from "next/image";

export default function NewJourneyPage() {
  const router = useRouter();
  const createJourney = useCreateJourney();

  function handleSubmit(values: JourneyFormValues) {
    createJourney.mutate(values, {
      onSuccess: (journey) => {
        router.push(`/admin/journeys/${journey.id}/edit`);
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h1 className="text-h2 font-bold">New Journey</h1>{" "}
          <JourneyForm
            onSubmit={handleSubmit}
            isSubmitting={createJourney.isPending}
            submitLabel="Create Journey"
          />
        </div>
        <div className="h-full rounded-md bg-fuchsia-500">
          {/* <Image src="/images/illustrations/undraw_adventure_map_re_60h4.svg" alt="Illustration of a map with mountains and a river" width={500} height={500} className="h-full w-full object-cover" /> */}
        </div>
      </div>
    </div>
  );
}
