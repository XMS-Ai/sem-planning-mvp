"use client";

import { Upload } from "lucide-react";

import { Input } from "@/components/ui/input";

interface UploadDropzoneOrInputProps {
  label: string;
  helper: string;
  multiple?: boolean;
  onFiles: (names: string[]) => void;
}

export function UploadDropzoneOrInput({
  label,
  helper,
  multiple,
  onFiles
}: UploadDropzoneOrInputProps) {
  return (
    <label className="flex cursor-pointer flex-col gap-2 rounded-xl border border-dashed border-border bg-secondary/40 p-4">
      <span className="flex items-center gap-2 text-sm font-medium">
        <Upload className="h-4 w-4" />
        {label}
      </span>
      <span className="text-xs text-muted-foreground">{helper}</span>
      <Input
        type="file"
        multiple={multiple}
        className="bg-white"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          onFiles(files.map((file) => file.name));
        }}
      />
    </label>
  );
}
