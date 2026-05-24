"use client";

export default function MyGroupsPage() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[#999]">Collaboration</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tighter text-[#2e3033]">
          My Groups
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <svg aria-hidden="true" className="h-28 w-28 text-[#e8e8e8] md:h-32 md:w-32" fill="none" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <h2 className="mt-5 text-xl font-bold text-[#2e3033]">No groups yet</h2>
          <p className="mt-2 text-[#999]">Create or join a group to collaborate with other teachers</p>
        </div>
      </div>
    </section>
  );
}
