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
    <div className="grid gap-3 text-sm font-medium text-[#2d2d2d]">
      <label className="flex min-h-[202px] cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#d0d0d0] bg-white px-4 py-8 text-center transition hover:border-[#b8b8b8] hover:bg-[#fbfbfb]">
        <input
          className="sr-only"
          type="file"
          accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleChange}
        />
        <svg aria-hidden="true" className="size-8 text-[#2d2d2d]" fill="none" viewBox="0 0 24 24">
          <path
            d="M8.4 17.2H7.5a4.5 4.5 0 0 1-.5-8.97 5.8 5.8 0 0 1 11.2 1.55A3.7 3.7 0 0 1 17 17.2h-1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
          />
          <path
            d="M12 18.5v-7M8.8 14.1 12 10.9l3.2 3.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
          />
        </svg>
        
        <div className="mt-6">
          <span className="block text-base font-semibold text-[#2d2d2d]">
            {fileName ?? "Choose a file or drag & drop it here"}
          </span>
          <span className="mt-2 block text-sm font-medium text-[#a0a0a0]">
            JPEG, PNG, upto 10MB
          </span>
        </div>

        <button
          type="button"
          className="mt-5 inline-flex h-9 items-center justify-center rounded-full bg-[#f4f4f4] px-7 text-sm font-medium text-[#2d2d2d] transition hover:bg-[#ececec]"
        >
          Browse Files
        </button>
      </label>
      <span className="block text-center text-base font-medium text-[#777]">
        Upload images of your preferred document/image
      </span>
      {error ? <span className="text-xs font-normal text-red-600">{error}</span> : null}
    </div>
  );
}
