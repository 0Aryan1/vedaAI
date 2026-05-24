"use client";

import type { ChangeEvent } from "react";

type FileUploadProps = {
  fileName?: string;
  error?: string;
  onFileNameChange: (fileName?: string) => void;
};

export function FileUpload({ fileName, error, onFileNameChange }: FileUploadProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onFileNameChange(event.target.files?.[0]?.name);
  }

  return (
    <div className="grid gap-2 text-sm font-medium text-slate-800">
      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-white">
        <input
          className="sr-only"
          type="file"
          accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleChange}
        />
        {/* Cloud Icon */}
        <svg aria-hidden="true" className="size-10 text-slate-400" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
            fill="currentColor"
          />
        </svg>
        
        <div>
          <span className="block text-sm font-semibold text-slate-900 sm:text-base">
            {fileName ?? "Choose a file or drag & drop it here"}
          </span>
          <span className="mt-2 block text-xs text-slate-500">
            JPEG, PNG, upto 10MB
          </span>
        </div>

        <button
          type="button"
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse Files
        </button>

        <span className="mt-1 block text-xs text-slate-500">
          Upload images of your preferred document/image
        </span>
      </label>
      {error ? <span className="text-xs font-normal text-red-600">{error}</span> : null}
    </div>
  );
}
