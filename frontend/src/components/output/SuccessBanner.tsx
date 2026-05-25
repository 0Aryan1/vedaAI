export function SuccessBanner() {
  return (
    <div className="mx-auto max-w-4xl mb-4">
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 shrink-0">
          <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">
            Question paper generated successfully!
          </p>
          <p className="text-xs text-emerald-600">
            Your AI-generated examination paper is ready for review and download.
          </p>
        </div>
      </div>
    </div>
  );
}
