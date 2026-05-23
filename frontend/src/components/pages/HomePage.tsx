"use client";

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[#999]">Dashboard</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tighter text-[#2e3033]">
          Welcome Home
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Stats */}
        <div className="rounded-2xl bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8] p-6">
          <h3 className="text-sm font-bold uppercase text-[#666]">Total Assignments</h3>
          <p className="mt-2 text-4xl font-bold text-[#2e3033]">0</p>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8] p-6">
          <h3 className="text-sm font-bold uppercase text-[#666]">Papers Generated</h3>
          <p className="mt-2 text-4xl font-bold text-[#2e3033]">0</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8] p-6">
          <h3 className="text-sm font-bold uppercase text-[#666]">Students</h3>
          <p className="mt-2 text-4xl font-bold text-[#2e3033]">0</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8] p-6">
          <h3 className="text-sm font-bold uppercase text-[#666]">Submissions</h3>
          <p className="mt-2 text-4xl font-bold text-[#2e3033]">0</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#2e3033]">Recent Activity</h2>
        <div className="mt-4 rounded-2xl border border-[#e8e8e8] p-6 text-center">
          <p className="text-[#999]">No recent activity yet</p>
        </div>
      </div>
    </section>
  );
}
