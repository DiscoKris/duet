import { PresentationProvider } from "@/components/duet/PresentationContext";
import { PresentationShell } from "@/components/duet/PresentationShell";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PresentationProvider>
      <PresentationShell>{children}</PresentationShell>
    </PresentationProvider>
  );
}
