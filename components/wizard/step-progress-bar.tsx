import { Progress } from "@/components/ui/progress";

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgressBar({
  currentStep,
  totalSteps
}: StepProgressBarProps) {
  const value = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{value}% complete</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
