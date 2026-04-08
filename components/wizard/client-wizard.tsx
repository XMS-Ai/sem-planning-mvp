"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { AdsPreviewCard } from "@/components/wizard/ads-preview-card";
import { BioCategorySelector } from "@/components/wizard/bio-category-selector";
import { BudgetSummaryCard } from "@/components/wizard/budget-summary-card";
import { BusinessHoursEditor } from "@/components/wizard/business-hours-editor";
import { CompactStepCard } from "@/components/wizard/compact-step-card";
import { DecisionCardGroup } from "@/components/wizard/decision-card-group";
import { GeoTargetSelector } from "@/components/wizard/geo-target-selector";
import { MissingInfoForm } from "@/components/wizard/missing-info-form";
import { MobileStepHeader } from "@/components/wizard/mobile-step-header";
import { ServiceCardList } from "@/components/wizard/service-card-list";
import { UploadDropzoneOrInput } from "@/components/wizard/upload-dropzone-or-input";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { ReviewSectionCard } from "@/components/review/review-section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DAY_LABELS } from "@/lib/utils";
import { REVIEW_SECTIONS, WIZARD_STEPS } from "@/lib/wizard-config";
import {
  clientResponseSchema,
  ClientResponseFormValues
} from "@/lib/validators";
import { Client, PlanningSession, ProposalSection } from "@/types/planning";

interface ClientWizardProps {
  client: Client;
  session: PlanningSession;
  onSaveDraft: (values: ClientResponseFormValues) => void;
  onSubmitFinal: (values: ClientResponseFormValues) => void;
}

const SECTION_TO_STEP: Record<ProposalSection, number> = {
  overview: 1,
  services: 2,
  budget: 3,
  geo: 4,
  assets: 5,
  hours: 6,
  bio: 7,
  ads: 8,
  recommendations: 9,
  review: 10
};

export function ClientWizard({
  client,
  session,
  onSaveDraft,
  onSubmitFinal
}: ClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(session.status === "submitted");

  const form = useForm<ClientResponseFormValues>({
    resolver: zodResolver(clientResponseSchema),
    defaultValues: session.response,
    mode: "onSubmit"
  });

  const {
    watch,
    setValue,
    trigger,
    getValues,
    register,
    reset,
    formState: { errors }
  } = form;

  useEffect(() => {
    reset(session.response);
    setSubmitted(session.status === "submitted");
  }, [session, reset]);

  const values = watch();

  const currentStepMeta = WIZARD_STEPS[currentStep - 1];

  const requiredMissingItems = useMemo(
    () => session.proposal.missingInfoChecklist.filter((item) => item.required),
    [session.proposal.missingInfoChecklist]
  );

  const validateStep = async () => {
    setStepError(null);

    if (currentStep === 1) {
      setValue("introAcknowledged", true, { shouldDirty: true });
      return true;
    }

    if (currentStep === 2) {
      return trigger(["services.decision", "services.comment"]);
    }

    if (currentStep === 3) {
      return trigger(["budget.decision", "budget.requestedBudgetNote", "budget.comment"]);
    }

    if (currentStep === 4) {
      return trigger([
        "geoTarget.decision",
        "geoTarget.preferredLocations",
        "geoTarget.note",
        "geoTarget.comment"
      ]);
    }

    if (currentStep === 5) {
      return trigger(["assets.logoFileName", "assets.photos", "assets.comment"]);
    }

    if (currentStep === 6) {
      return trigger(["businessHours", "hoursNotes"]);
    }

    if (currentStep === 7) {
      const ok = await trigger(["businessBioSelection"]);
      if (!ok) return false;
      if (getValues("businessBioSelection").length === 0) {
        setStepError("Please choose at least one category.");
        return false;
      }
      return true;
    }

    if (currentStep === 8) {
      return trigger(["adsPreviewComment"]);
    }

    if (currentStep === 9) {
      const valid = await trigger([
        "acknowledgedMissingItems",
        "missingInfoResponses",
        "finalComment"
      ]);
      if (!valid) return false;

      const snapshot = getValues();
      const missingRequired = requiredMissingItems.find((item) => {
        const value = snapshot.missingInfoResponses[item.id];
        const acknowledged = snapshot.acknowledgedMissingItems.includes(item.id);

        if (item.fieldType === "checkbox") {
          return !Boolean(value) && !acknowledged;
        }

        if (typeof value === "number") {
          return Number.isNaN(value) || value <= 0;
        }

        if (Array.isArray(value)) {
          return value.length === 0;
        }

        return String(value ?? "").trim().length === 0;
      });

      if (missingRequired) {
        setStepError(`Please complete required item: ${missingRequired.label}`);
        return false;
      }

      return true;
    }

    return true;
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const handleNext = async () => {
    const valid = await validateStep();
    if (!valid) return;

    const snapshot = getValues();
    onSaveDraft(snapshot);

    if (currentStep === 10) {
      onSubmitFinal(snapshot);
      setSubmitted(true);
      return;
    }

    setCurrentStep((step) => Math.min(10, step + 1));
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6">
        <Card className="w-full border-emerald-200 bg-emerald-50">
          <CardContent className="space-y-4 p-5 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
            <div>
              <h2 className="text-lg font-semibold">Submission complete</h2>
              <p className="text-sm text-muted-foreground">
                Thank you. Your planning review for {client.name} was submitted successfully.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
              Reopen review
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <WizardLayout
      header={
        <MobileStepHeader
          logoUrl={client.logoUrl}
          companyName={client.name}
          currentStep={currentStep}
          totalSteps={WIZARD_STEPS.length}
          stepTitle={currentStepMeta.title}
          stepDescription={currentStepMeta.description}
        />
      }
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={handleNext}
      nextLabel={currentStep === 10 ? "Submit" : "Continue"}
    >
      {stepError ? (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="flex items-center gap-2 p-3 text-sm text-amber-900">
            <TriangleAlert className="h-4 w-4" />
            {stepError}
          </CardContent>
        </Card>
      ) : null}

      {currentStep === 1 ? (
        <CompactStepCard
          title="Welcome to your LSA planning review"
          description="This workflow replaces email back-and-forth so we can finalize your setup faster."
        >
          <p className="text-sm text-muted-foreground">{session.proposal.kpiContext}</p>
          <div className="grid gap-2">
            {session.proposal.kpiBlocks.map((kpi) => (
              <div key={kpi.id} className="rounded-xl border bg-white p-3">
                <p className="text-sm font-medium">{kpi.title}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            ))}
          </div>
        </CompactStepCard>
      ) : null}

      {currentStep === 2 ? (
        <CompactStepCard title="Services" description="Review selected and recommended services.">
          <ServiceCardList
            selected={session.proposal.services.selected}
            recommended={session.proposal.services.recommended}
          />

          <DecisionCardGroup
            decision={values.services.decision}
            onDecisionChange={(value) =>
              setValue("services.decision", value, { shouldDirty: true, shouldValidate: true })
            }
            comment={values.services.comment}
            onCommentChange={(value) =>
              setValue("services.comment", value, { shouldDirty: true, shouldValidate: true })
            }
          />
        </CompactStepCard>
      ) : null}

      {currentStep === 3 ? (
        <CompactStepCard title="Budget & Bidding" description="Confirm plan and request adjustments if needed.">
          <BudgetSummaryCard budget={session.proposal.budget} />

          <DecisionCardGroup
            decision={values.budget.decision}
            onDecisionChange={(value) =>
              setValue("budget.decision", value, { shouldDirty: true, shouldValidate: true })
            }
            comment={values.budget.comment}
            onCommentChange={(value) =>
              setValue("budget.comment", value, { shouldDirty: true, shouldValidate: true })
            }
          />

          <div className="grid gap-2">
            <p className="text-xs font-medium text-muted-foreground">Requested budget note (optional)</p>
            <Textarea
              value={values.budget.requestedBudgetNote || ""}
              onChange={(event) =>
                setValue("budget.requestedBudgetNote", event.target.value, {
                  shouldDirty: true,
                  shouldValidate: true
                })
              }
            />
          </div>
        </CompactStepCard>
      ) : null}

      {currentStep === 4 ? (
        <CompactStepCard title="Geo Target" description="Confirm and adjust preferred target areas.">
          <div className="rounded-xl border bg-secondary/40 p-3 text-sm text-muted-foreground">
            {session.proposal.geoTarget.recommendation}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Preferred areas</p>
            <GeoTargetSelector
              locations={session.proposal.geoTarget.visibleLocations}
              selected={values.geoTarget.preferredLocations}
              onToggle={(location) => {
                const selected = values.geoTarget.preferredLocations;
                const next = selected.includes(location)
                  ? selected.filter((item) => item !== location)
                  : [...selected, location];
                setValue("geoTarget.preferredLocations", next, {
                  shouldDirty: true,
                  shouldValidate: true
                });
              }}
            />
          </div>

          <DecisionCardGroup
            decision={values.geoTarget.decision}
            onDecisionChange={(value) =>
              setValue("geoTarget.decision", value, { shouldDirty: true, shouldValidate: true })
            }
            comment={values.geoTarget.comment}
            onCommentChange={(value) =>
              setValue("geoTarget.comment", value, { shouldDirty: true, shouldValidate: true })
            }
          />

          <div className="grid gap-2">
            <p className="text-xs font-medium text-muted-foreground">Adjustment note (optional)</p>
            <Textarea
              value={values.geoTarget.note || ""}
              onChange={(event) =>
                setValue("geoTarget.note", event.target.value, {
                  shouldDirty: true,
                  shouldValidate: true
                })
              }
            />
          </div>
        </CompactStepCard>
      ) : null}

      {currentStep === 5 ? (
        <CompactStepCard title="Photos & Assets" description="Upload or simulate required files.">
          <div className="space-y-2">
            {session.proposal.assetRequirements.map((item) => (
              <div key={item.id} className="rounded-xl border bg-white p-3">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.instructions}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Format: {item.acceptedFileTypes.join(", ")} | Max {item.maxSizeMb} MB | Min {item.minResolution}
                </p>
              </div>
            ))}
          </div>

          <UploadDropzoneOrInput
            label="Upload logo"
            helper="Local preview only for MVP"
            onFiles={(files) =>
              setValue("assets.logoFileName", files[0] || "", {
                shouldDirty: true,
                shouldValidate: true
              })
            }
          />

          <UploadDropzoneOrInput
            label="Upload business photos"
            helper="You can upload multiple files"
            multiple
            onFiles={(files) =>
              setValue("assets.photos", files, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
          />

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Logo: {values.assets.logoFileName || "No file selected"}
            </p>
            <p className="text-xs text-muted-foreground">
              Photos: {values.assets.photos.length > 0 ? values.assets.photos.join(", ") : "No files selected"}
            </p>
          </div>

          <Textarea
            placeholder="Comments about uploads"
            value={values.assets.comment || ""}
            onChange={(event) =>
              setValue("assets.comment", event.target.value, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
          />
        </CompactStepCard>
      ) : null}

      {currentStep === 6 ? (
        <CompactStepCard title="Business Hours" description="Confirm daily schedule and weekend/holiday notes.">
          <BusinessHoursEditor
            hours={values.businessHours}
            onChange={(hours) =>
              setValue("businessHours", hours, { shouldDirty: true, shouldValidate: true })
            }
          />

          <Textarea
            placeholder="Weekend and holiday note"
            value={values.hoursNotes || ""}
            onChange={(event) =>
              setValue("hoursNotes", event.target.value, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
          />

          {errors.businessHours ? (
            <p className="text-xs text-destructive">Please verify open/close times for open days.</p>
          ) : null}
        </CompactStepCard>
      ) : null}

      {currentStep === 7 ? (
        <CompactStepCard title="Business Bio" description="Choose only 6 categories.">
          <BioCategorySelector
            options={session.proposal.businessBioOptions}
            selected={values.businessBioSelection}
            onChange={(value) =>
              setValue("businessBioSelection", value, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
          />
          {errors.businessBioSelection ? (
            <p className="text-xs text-destructive">{errors.businessBioSelection.message}</p>
          ) : null}
        </CompactStepCard>
      ) : null}

      {currentStep === 8 ? (
        <CompactStepCard title="Ads Preview" description="Preview style and leave optional feedback.">
          <AdsPreviewCard note={session.proposal.adsPreviewNote} />
          <Textarea
            placeholder="Optional ad preview feedback"
            value={values.adsPreviewComment || ""}
            onChange={(event) =>
              setValue("adsPreviewComment", event.target.value, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
          />
        </CompactStepCard>
      ) : null}

      {currentStep === 9 ? (
        <CompactStepCard
          title="Recommendations & Missing Info"
          description="Review recommendations and provide required pending information."
        >
          <div className="space-y-2 rounded-xl border bg-secondary/40 p-3">
            <p className="text-sm font-medium">SEM Team Recommendations</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {session.proposal.recommendations.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <MissingInfoForm
            items={session.proposal.missingInfoChecklist}
            values={values.missingInfoResponses}
            acknowledged={values.acknowledgedMissingItems}
            onValueChange={(id, value) => {
              setValue(
                "missingInfoResponses",
                {
                  ...values.missingInfoResponses,
                  [id]: value
                },
                {
                  shouldDirty: true,
                  shouldValidate: true
                }
              );
            }}
            onAcknowledgedChange={(items) =>
              setValue("acknowledgedMissingItems", items, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
          />

          <Textarea
            placeholder="Any additional final comments"
            {...register("finalComment")}
          />
        </CompactStepCard>
      ) : null}

      {currentStep === 10 ? (
        <CompactStepCard
          title="Review & Submit"
          description="Confirm every section. Use Edit to jump back to any step."
        >
          {REVIEW_SECTIONS.map((section) => (
            <ReviewSectionCard
              key={section.id}
              title={section.title}
              onEdit={() => setCurrentStep(SECTION_TO_STEP[section.id])}
            >
              {section.id === "services" ? (
                <>
                  <p>Decision: {values.services.decision}</p>
                  <p>Comment: {values.services.comment || "No comment"}</p>
                </>
              ) : null}

              {section.id === "budget" ? (
                <>
                  <p>Decision: {values.budget.decision}</p>
                  <p>Requested note: {values.budget.requestedBudgetNote || "None"}</p>
                  <p>Comment: {values.budget.comment || "No comment"}</p>
                </>
              ) : null}

              {section.id === "geo" ? (
                <>
                  <p>Decision: {values.geoTarget.decision}</p>
                  <p>Preferred: {values.geoTarget.preferredLocations.join(", ") || "None"}</p>
                  <p>Comment: {values.geoTarget.comment || "No comment"}</p>
                </>
              ) : null}

              {section.id === "assets" ? (
                <>
                  <p>Logo: {values.assets.logoFileName || "Not uploaded"}</p>
                  <p>Photos: {values.assets.photos.join(", ") || "Not uploaded"}</p>
                  <p>Comment: {values.assets.comment || "No comment"}</p>
                </>
              ) : null}

              {section.id === "hours" ? (
                <>
                  {values.businessHours.map((hour) => (
                    <p key={hour.day}>
                      {DAY_LABELS[hour.day]}: {hour.isClosed ? "Closed" : `${hour.openTime} - ${hour.closeTime}`}
                    </p>
                  ))}
                  <p>Notes: {values.hoursNotes || "No notes"}</p>
                </>
              ) : null}

              {section.id === "bio" ? (
                <>
                  <p>
                    Selected: {values.businessBioSelection.length} / 6
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {values.businessBioSelection.map((id) => {
                      const option = session.proposal.businessBioOptions.find((item) => item.id === id);
                      return (
                        <Badge key={id} variant="secondary">
                          {option?.label || id}
                        </Badge>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {section.id === "ads" ? <p>{values.adsPreviewComment || "No feedback"}</p> : null}

              {section.id === "recommendations" ? (
                <>
                  <p>
                    Acknowledged: {values.acknowledgedMissingItems.length} / {session.proposal.missingInfoChecklist.length}
                  </p>
                  {session.proposal.missingInfoChecklist.map((item) => (
                    <p key={item.id}>
                      {item.label}: {String(values.missingInfoResponses[item.id] ?? "") || "Pending"}
                    </p>
                  ))}
                  <p>Final comment: {values.finalComment || "None"}</p>
                </>
              ) : null}
            </ReviewSectionCard>
          ))}

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="space-y-3 p-4">
              <p className="text-sm font-medium">Ready to submit?</p>
              <p className="text-xs text-muted-foreground">
                Submitting marks this planning as complete in local mock state.
              </p>
            </CardContent>
          </Card>
        </CompactStepCard>
      ) : null}

      <input type="hidden" {...register("introAcknowledged")} />
      <Input type="hidden" {...register("services.decision")} />
      <Input type="hidden" {...register("budget.decision")} />
      <Input type="hidden" {...register("geoTarget.decision")} />
    </WizardLayout>
  );
}
