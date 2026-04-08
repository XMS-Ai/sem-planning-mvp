"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { AdminPlanningForm } from "@/components/admin/admin-planning-form";
import { Button } from "@/components/ui/button";
import { createFreshResponse, createProposalFromBuilder, sessionToBuilderValues } from "@/lib/planning-mappers";
import { usePlanningStore } from "@/lib/store";
import { slugify } from "@/lib/utils";
import { PlanningBuilderValues } from "@/lib/validators";

export default function NewPlanningPage() {
  const router = useRouter();
  const { sessions, getClientById, createPlanning, updateSessionProposal, updateSessionResponse } =
    usePlanningStore();

  const initialValues = useMemo<PlanningBuilderValues>(() => {
    const templateSession = sessions[0];
    const templateClient = templateSession ? getClientById(templateSession.clientId) : undefined;

    if (templateSession && templateClient) {
      return {
        ...sessionToBuilderValues(templateSession, templateClient),
        clientName: "",
        slug: "",
        logoUrl: ""
      };
    }

    return {
      clientName: "",
      slug: "",
      logoUrl: "",
      selectedServicesText: "Gutter Installation",
      recommendedServicesText: "Gutter Repair",
      weeklyBudget: 300,
      monthlyBudget: 1300,
      minimumRequiredBudget: 1300,
      budgetNote: "Recommended budget range is 1500-1800/month.",
      geoRecommendation: "Prioritize high-converting zip codes first.",
      locationsText: "Jupiter\nStuart",
      recommendationsText: "Collect reviews weekly",
      missingInfoText: "Images and logo\nWeekend business hours",
      assetInstructionsText: "Upload high-quality photos of recent projects.",
      businessBioOptionsText: "Free Estimate\nFamily-owned & operated",
      adsPreviewNote: "Final ads may vary based on available content and variables."
    };
  }, [sessions, getClientById]);

  const handleSubmit = (values: PlanningBuilderValues) => {
    const session = createPlanning({
      clientName: values.clientName,
      slug: slugify(values.slug || values.clientName),
      logoUrl: values.logoUrl || undefined
    });

    const proposal = createProposalFromBuilder(values);
    const response = createFreshResponse(proposal);

    updateSessionProposal(session.id, proposal);
    updateSessionResponse(session.id, response, "in_review");

    router.push(`/admin/planning/${session.id}`);
  };

  return (
    <AppShell
      title="Create New Planning"
      subtitle="Prepare a client-ready LSA workflow from your internal SEM proposal."
      rightSlot={
        <Button variant="outline" onClick={() => router.push("/admin")}>Back to admin</Button>
      }
    >
      <AdminPlanningForm defaultValues={initialValues} onSubmit={handleSubmit} submitLabel="Create planning" />
    </AppShell>
  );
}
