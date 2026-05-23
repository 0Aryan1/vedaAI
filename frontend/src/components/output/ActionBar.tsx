"use client";

import Link from "next/link";
import { routes } from "@/constants/routes";
import { Button } from "@/components/ui/Button";

export function ActionBar() {
  function downloadPdf() {
    window.print();
  }

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Question paper preview</p>
          <p className="text-xs text-slate-500">Validated structured output</p>
        </div>
        <div className="flex gap-2">
          <Link href={routes.createAssignment}>
            <Button variant="secondary">Regenerate</Button>
          </Link>
          <Button type="button" onClick={downloadPdf}>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
