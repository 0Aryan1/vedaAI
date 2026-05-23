const fields = ["Name", "Roll Number", "Section"];

export function StudentInfoSection() {
  return (
    <div className="grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-3">
      {fields.map((field) => (
        <div key={field} className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{field}</span>
          <span className="h-8 border-b border-slate-300" />
        </div>
      ))}
    </div>
  );
}
