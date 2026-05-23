"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ActionBar } from "@/components/output/ActionBar";
import { PaperDocument } from "@/components/output/PaperDocument";
import { Button } from "@/components/ui/Button";
import { routes } from "@/constants/routes";
import { useAssignmentStore } from "@/store";

export default function OutputPage() {
  const params = useParams<{ id: string }>();
  const paper = useAssignmentStore((state) => state.getPaper(params.id));

  if (!paper) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-950">Paper not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          Generate a new assessment to preview the structured question paper.
        </p>
        <Link className="mt-6 inline-flex" href={routes.createAssignment}>
          <Button>Create assignment</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ActionBar />
      <PaperDocument paper={paper} />
    </div>
  );
}
