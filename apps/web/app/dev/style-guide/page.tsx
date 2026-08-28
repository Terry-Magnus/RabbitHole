import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { DemoForm } from "./demo-form";

const colorSwatches: { label: string; className: string }[] = [
  { label: "brand-500 (primary)", className: "bg-brand-500" },
  { label: "brand-100 (soft surface)", className: "bg-brand-100" },
  { label: "curiosity-500 (discovery)", className: "bg-discovery" },
  { label: "success-500", className: "bg-success-500" },
  { label: "warning-500", className: "bg-warning-500" },
  { label: "error-500", className: "bg-error-500" },
  { label: "info-500", className: "bg-info-500" },
  { label: "surface", className: "bg-surface" },
  { label: "surface-elevated", className: "bg-surface-elevated" },
  { label: "background", className: "border border-border bg-background" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-h3 font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 p-8">
      <div>
        <h1 className="text-h1 font-bold">Style Guide</h1>
        <p className="text-body text-muted-foreground">
          Internal reference for Rabbit Hole&apos;s design tokens and shared components.
          Not linked from the app.
        </p>
      </div>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {colorSwatches.map((swatch) => (
            <div key={swatch.label} className="space-y-2">
              <div className={`h-16 rounded-md ${swatch.className}`} />
              <p className="text-caption text-muted-foreground">{swatch.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-2">
          <p className="text-display font-bold">Display</p>
          <p className="text-h1 font-bold">Heading 1</p>
          <p className="text-h2 font-bold">Heading 2</p>
          <p className="text-h3 font-bold">Heading 3</p>
          <p className="text-h4 font-bold">Heading 4</p>
          <p className="text-h5 font-bold">Heading 5</p>
          <p className="text-body-lg">Large body text</p>
          <p className="text-body">Body text</p>
          <p className="text-small">Small text</p>
          <p className="text-caption">Caption text</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Journey title</CardTitle>
            <CardDescription>A short description of the journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm">Start</Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Form">
        <DemoForm />
      </Section>

      <Section title="Loading state">
        <div className="flex max-w-sm flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Section>

      <Section title="Empty state">
        <EmptyState
          icon={Compass}
          title="No journeys yet"
          description="Once journeys are published, they'll show up here."
        />
      </Section>
    </div>
  );
}
