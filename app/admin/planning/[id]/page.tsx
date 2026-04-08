"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { AdminPlanningForm } from "@/components/admin/admin-planning-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { builderValuesToProposal, sessionToBuilderValues } from "@/lib/planning-mappers";
import { usePlanningStore } from "@/lib/store";
import { slugify } from "@/lib/utils";
import { PlanningBuilderValues } from "@/lib/validators";

const statusLabel = {
  draft: "Draft",
  in_review: "In review",
  submitted: "Submitted"
};

export default function AdminPlanningDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    hydrated,
    getSessionById,
    getClientById,
    updateClient,
    updateSessionProposal,
    updateSessionResponse
  } = usePlanningStore();

  const session = getSessionById(params.id);
  const client = session ? getClientById(session.clientId) : undefined;

  const defaultValues = useMemo<PlanningBuilderValues | null>(() => {
    if (!session || !client) return null;
    return sessionToBuilderValues(session, client);
  }, [session, client]);

  if (!hydrated) {
    return (
      <AppShell title="Planning Builder" subtitle="Loading session...">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AppShell>
    );
  }

  if (!session || !client || !defaultValues) {
    return (
      <AppShell title="Planning not found" subtitle="This planning session does not exist.">
        <Button onClick={() => router.push("/admin")}>Back to admin</Button>
      </AppShell>
    );
  }

  const handleSubmit = (values: PlanningBuilderValues) => {
    const nextSlug = slugify(values.slug || values.clientName);

    updateClient(client.id, {
      name: values.clientName,
      slug: nextSlug,
      logoUrl: values.logoUrl || undefined
    });

    const proposal = builderValuesToProposal(values, session.proposal);
    updateSessionProposal(session.id, proposal);

    const filteredResponse = {
      ...session.response,
      businessBioSelection: session.response.businessBioSelection.filter((id) =>
        proposal.businessBioOptions.some((option) => option.id === id)
      ),
      geoTarget: {
        ...session.response.geoTarget,
        preferredLocations: session.response.geoTarget.preferredLocations.filter((location) =>
          proposal.geoTarget.visibleLocations.includes(location)
        )
      }
    };

    updateSessionResponse(
      session.id,
      filteredResponse,
      session.status === "draft" ? "in_review" : session.status
    );
  };

  return (
    <AppShell
      title={`Planning Builder · ${client.name}`}
      subtitle="Edit proposal content and publish the client-facing wizard link."
      rightSlot={<Badge>{statusLabel[session.status]}</Badge>}
    >
      <AdminPlanningForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        publicPath={`/client/${client.slug}`}
        onPreview={() => window.open(`/client/${client.slug}`, "_blank")}
      />
    </AppShell>
  );
}
