import { Badge } from "@/components/ui/Badge";
import { ProgressIndicator } from "./ProgressIndicator";

type StatusBarProps = {
  progress: number;
  message: string;
};

export function StatusBar({ progress, message }: StatusBarProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-800">{message}</p>
        <Badge tone={progress >= 100 ? "green" : "blue"}>{progress}%</Badge>
      </div>
      <ProgressIndicator value={progress} />
    </div>
  );
}
