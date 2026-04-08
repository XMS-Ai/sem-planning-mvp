import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { StepProgressBar } from "@/components/wizard/step-progress-bar";

interface MobileStepHeaderProps {
  logoUrl?: string;
  companyName: string;
  stepTitle: string;
  stepDescription: string;
  currentStep: number;
  totalSteps: number;
}

export function MobileStepHeader({
  logoUrl,
  companyName,
  stepTitle,
  stepDescription,
  currentStep,
  totalSteps
}: MobileStepHeaderProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-border/60 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto w-full max-w-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-border/70 bg-secondary">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={companyName}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-semibold text-muted-foreground">
                {companyName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{companyName}</p>
            <p className="truncate text-xs text-muted-foreground">LSA Planning Review</p>
          </div>
          <Badge variant="secondary">Client View</Badge>
        </div>
        <div>
          <h2 className="text-base font-semibold leading-tight">{stepTitle}</h2>
          <p className="text-xs text-muted-foreground">{stepDescription}</p>
        </div>
        <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </div>
  );
}
