import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface WizardLayoutProps {
  header: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  disableNext?: boolean;
  backLabel?: string;
  nextLabel?: string;
  hideActions?: boolean;
}

export function WizardLayout({
  header,
  children,
  onBack,
  onNext,
  disableNext,
  backLabel = "Back",
  nextLabel = "Continue",
  hideActions
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen">
      {header}
      <div className="mx-auto w-full max-w-xl space-y-4 px-4 py-4 pb-28">{children}</div>
      {!hideActions ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-white/95 p-4 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-xl items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="default"
              className="flex-1"
              onClick={onBack}
              disabled={!onBack}
            >
              {backLabel}
            </Button>
            <Button
              type="button"
              size="default"
              className="flex-1"
              onClick={onNext}
              disabled={disableNext}
            >
              {nextLabel}
            </Button>
          </div>
        </div>
      ) : null}

    </div>
  );
}
