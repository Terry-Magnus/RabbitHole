"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRemoveNodeImage, useUploadNodeImage } from "../hooks/use-node-image-mutations";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NodeImageFieldProps {
  journeyId: string;
  nodeId: string;
  imageUrl: string | null;
}

export function NodeImageField({ journeyId, nodeId, imageUrl }: NodeImageFieldProps) {
  const uploadImage = useUploadNodeImage(journeyId, nodeId);
  const removeImage = useRemoveNodeImage(journeyId, nodeId);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage.mutate(file);
    }
    event.target.value = "";
  }

  return (
    <div className="space-y-3">
      {imageUrl ? (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- served from
              the API's own origin; next/image would need remotePatterns
              configured for that host, unnecessary for an admin-only tool. */}
          <img
            src={`${API_URL}${imageUrl}`}
            alt=""
            className="h-24 w-24 rounded-md object-cover ring-1 ring-border"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => removeImage.mutate()}
            isLoading={removeImage.isPending}
          >
            Remove
          </Button>
        </div>
      ) : null}
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploadImage.isPending}
      />
    </div>
  );
}
