import { cn } from "@/lib/utils/cn";

type ProgressIndicatorProps = {
  value: number;
  className?: string;
};

export function ProgressIndicator({ value, className }: ProgressIndicatorProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className="h-full rounded-full bg-slate-950 transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
