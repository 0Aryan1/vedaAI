"use client";

import { Textarea } from "@/components/ui/Input";

type InstructionsInputProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function InstructionsInput({ value, error, onChange }: InstructionsInputProps) {
  return (
    <Textarea
      label="Additional Information (For better output)"
      placeholder="e.g Generate a question paper for 3 hour exam duration.."
      value={value}
      error={error}
      hint={`${value.length}/1200 characters`}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
