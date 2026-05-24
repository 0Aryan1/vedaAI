"use client";

export default function MyLibraryPage() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[#999]">Resources</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tighter text-[#2e3033]">
          My Library
        </h1>
      </div>

      {/* <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-dashed border-[#e8e8e8] p-8 text-center transition hover:border-[#ff8a1f]">
          <svg aria-hidden="true" className="mx-auto h-16 w-16 text-[#e8e8e8]" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          <h3 className="mt-4 font-bold text-[#2e3033]">Add Resource</h3>
          <p className="mt-2 text-sm text-[#999]">Upload PDFs, documents, or images</p>
        </div>
      </div> */}

      <div className="mt-6">
        {/* <h2 className="text-2xl font-bold text-[#2e3033]">Your Resources</h2> */}
        <div className="mt-4 rounded-2xl border border-[#e8e8e8] p-5 text-center">
          <p className="text-[#999]">No resources added yet</p>
        </div>
      </div>
    </section>
  );
}
