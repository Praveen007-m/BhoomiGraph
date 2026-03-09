import { ReactNode } from "react";
import { BackButton } from "../common/BackButton";
import { Topbar } from "./Topbar";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  showBack?: boolean;
}

export function PageLayout({
  title,
  description,
  children,
  showBack = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Topbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

          {showBack && <BackButton label="Back" />}

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}