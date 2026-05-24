"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { PaperDocument } from "@/components/output/PaperDocument";
import type { QuestionPaper } from "@/types/question-paper";

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportCurrentPage = async (paper: QuestionPaper): Promise<void> => {
    setIsExporting(true);
    
    try {
      const blob = await pdf(PaperDocument({ paper })).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${paper.title}-${paper.subject}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportCurrentPage,
    isExporting,
  };
}
