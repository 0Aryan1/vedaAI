"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ActionBar } from "@/components/output/ActionBar";
import { PaperHeader } from "@/components/output/PaperHeader";
import { StudentInfoSection } from "@/components/output/StudentInfoSection";
import { SectionBlock } from "@/components/output/SectionBlock";
import { AnswerKeySection } from "@/components/output/AnswerKeySection";
import { Button } from "@/components/ui/Button";
import { routes } from "@/constants/routes";
import { paperApi } from "@/lib/api/papers";
import { useAssignmentStore } from "@/store";
import type { QuestionPaper, QuestionSection } from "@/types/question-paper";

function getStartNumber(
  sections: QuestionSection[],
  sectionIndex: number
): number {
  let count = 1;
  for (let i = 0; i < sectionIndex; i++) {
    count += sections[i].questions.length;
  }
  return count;
}

export default function OutputPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) {
        console.log("[Output] No paper ID provided");
        setError("No paper ID provided");
        setLoading(false);
        return;
      }

      console.log("[Output] id:", id);

      // First, try to get from local store
      const storedPaper = useAssignmentStore.getState().getPaper(id);
      if (storedPaper) {
        console.log("[Output] Paper found in store:", storedPaper.title);
        setPaper(storedPaper);
        setLoading(false);
        return;
      }

      // If not in store, fetch from backend
      console.log("[Output] Paper not in store, fetching from backend:", id);
      try {
        const fetchedPaper = await paperApi.getById(id);
        console.log("[Output] Paper fetched from backend:", fetchedPaper.title);
        setPaper(fetchedPaper);

        // Also save to store for future access
        useAssignmentStore.getState().savePaper(fetchedPaper);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch paper";
        console.error("[Output] Fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-sm">
          <div className="size-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <p className="text-sm text-gray-600">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Paper not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            {error || "Generate a new assessment to preview the structured question paper."}
          </p>
          <Link className="mt-6 inline-flex" href={routes.createAssignment}>
            <Button>Create assignment</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Action bar — hidden on print */}
      <div className="no-print max-w-4xl mx-auto mb-6">
        <ActionBar paper={paper} />
      </div>

      {/* Paper preview — this is what gets printed */}
      <div
        id="paper-print-area"
        className="bg-white rounded-2xl shadow-sm max-w-4xl mx-auto p-10 font-sans print:shadow-none print:rounded-none print:p-0 print:max-w-none"
      >
        <PaperHeader paper={paper} />
        <StudentInfoSection gradeLevel={paper.className} />

        {paper.sections.map((section, index) => (
          <SectionBlock
            key={section.id}
            section={section}
            startNumber={getStartNumber(paper.sections, index)}
          />
        ))}

        <p className="font-bold text-sm mt-6 mb-8">End of Question Paper</p>

        <AnswerKeySection paper={paper} />
      </div>
    </div>
  );
}
