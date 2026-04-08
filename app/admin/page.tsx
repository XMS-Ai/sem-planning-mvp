"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlanningStore } from "@/lib/store";

const statusLabel = {
  draft: "Draft",
  in_review: "In review",
  submitted: "Submitted"
};

export default function AdminPage() {
  const { sessions, getClientById, resetSeedData, hydrated } = usePlanningStore();

  if (!hydrated) {
    return (
      <AppShell title="SEM Planning Admin" subtitle="Loading demo planning sessions...">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="SEM Planning Admin"
      subtitle="Create and manage LSA planning proposals before sharing with clients."
      rightSlot={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/planning/new">New planning</Link>
          </Button>
          <Button variant="ghost" onClick={resetSeedData}>
            Reset demo
          </Button>
        </div>
      }
    >
      <div className="grid gap-3">
        {sessions.map((session) => {
          const client = getClientById(session.clientId);
          if (!client) return null;

          return (
            <Card key={session.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <CardDescription className="text-xs">/{client.slug}</CardDescription>
                  </div>
                  <Badge variant={session.status === "submitted" ? "success" : "secondary"}>
                    {statusLabel[session.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/planning/${session.id}`}>Open builder</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/client/${client.slug}`} target="_blank">
                    Open client URL
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
