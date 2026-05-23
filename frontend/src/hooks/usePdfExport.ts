"use client";

export function usePdfExport() {
  return {
    exportCurrentPage: () => window.print(),
  };
}
