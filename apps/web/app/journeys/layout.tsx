import { RopeWidget } from "@/modules/rope/components/rope-widget";

export default function JourneysLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <RopeWidget />
    </>
  );
}
