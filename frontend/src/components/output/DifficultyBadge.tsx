import { Badge } from "@/components/ui/Badge";
import type { Difficulty } from "@/types/question-paper";

const difficultyMeta: Record<Difficulty, { label: string; tone: "green" | "amber" | "red" }> = {
  easy: { label: "Easy", tone: "green" },
  medium: { label: "Moderate", tone: "amber" },
  hard: { label: "Hard", tone: "red" },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const meta = difficultyMeta[difficulty];

  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
