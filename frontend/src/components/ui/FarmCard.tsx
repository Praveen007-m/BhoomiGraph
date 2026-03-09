import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FarmCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white",
        className
      )}
    >
      {children}
    </Card>
  );
}