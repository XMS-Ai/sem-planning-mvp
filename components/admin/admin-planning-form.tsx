"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, Save } from "lucide-react";

import { GeneratedPublicUrlCard } from "@/components/admin/generated-public-url-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  planningBuilderSchema,
  type PlanningBuilderValues
} from "@/lib/validators";

interface AdminPlanningFormProps {
  defaultValues: PlanningBuilderValues;
  onSubmit: (values: PlanningBuilderValues) => void;
  submitLabel?: string;
  publicPath?: string;
  onPreview?: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function AdminPlanningForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save Planning",
  publicPath,
  onPreview
}: AdminPlanningFormProps) {
  const form = useForm<PlanningBuilderValues>({
    resolver: zodResolver(planningBuilderSchema),
    defaultValues,
    mode: "onSubmit"
  });

  const { register, handleSubmit, formState } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 pb-20 md:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">1. Basic Client Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="clientName">Company name</Label>
              <Input id="clientName" {...register("clientName")} />
              <FieldError message={formState.errors.clientName?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Public slug</Label>
              <Input id="slug" {...register("slug")} />
              <FieldError message={formState.errors.slug?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" placeholder="https://..." {...register("logoUrl")} />
              <FieldError message={formState.errors.logoUrl?.message} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">2. Services</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>Selected services</Label>
              <Textarea
                {...register("selectedServicesText")}
                placeholder="One service per line"
              />
              <FieldError message={formState.errors.selectedServicesText?.message} />
            </div>
            <div className="grid gap-2">
              <Label>Recommended services</Label>
              <Textarea
                {...register("recommendedServicesText")}
                placeholder="One service per line"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">3. Budget & Bidding</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Weekly budget</Label>
                <Input type="number" {...register("weeklyBudget")} />
              </div>
              <div className="grid gap-2">
                <Label>Monthly budget</Label>
                <Input type="number" {...register("monthlyBudget")} />
              </div>
              <div className="grid gap-2">
                <Label>Minimum required budget</Label>
                <Input type="number" {...register("minimumRequiredBudget")} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Budget recommendation note</Label>
              <Textarea {...register("budgetNote")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">4. Geo Target</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>Geo recommendation</Label>
              <Textarea {...register("geoRecommendation")} />
            </div>
            <div className="grid gap-2">
              <Label>Visible target locations</Label>
              <Textarea
                {...register("locationsText")}
                placeholder="One location per line"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">5. Assets, Bio, Ads & Checklist</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>Asset instructions</Label>
              <Textarea {...register("assetInstructionsText")} />
            </div>
            <div className="grid gap-2">
              <Label>Business bio options</Label>
              <Textarea
                {...register("businessBioOptionsText")}
                placeholder="One option per line"
              />
            </div>
            <div className="grid gap-2">
              <Label>Ads preview note</Label>
              <Textarea {...register("adsPreviewNote")} />
            </div>
            <div className="grid gap-2">
              <Label>Recommendations and comments</Label>
              <Textarea
                {...register("recommendationsText")}
                placeholder="One recommendation per line"
              />
            </div>
            <div className="grid gap-2">
              <Label>Missing information requested</Label>
              <Textarea
                {...register("missingInfoText")}
                placeholder="One item per line"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4 md:sticky md:top-4 md:h-fit">
        {publicPath ? <GeneratedPublicUrlCard publicPath={publicPath} /> : null}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </Button>
            {onPreview ? (
              <Button type="button" variant="outline" className="w-full" onClick={onPreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview client flow
              </Button>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Changes are stored in local mock state for this MVP.
            </p>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}
