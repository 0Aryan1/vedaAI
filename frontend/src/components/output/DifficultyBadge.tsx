interface DifficultyBadgeProps {
  difficulty: string;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config: Record<
    string,
    { label: string; class: string }
  > = {
    easy: {
      label: "Easy",
      class: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    medium: {
      label: "Moderate",
      class: "bg-amber-100 text-amber-700 border-amber-200",
    },
    hard: {
      label: "Challenging",
      class: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const diffConfig = config[difficulty] || config.medium;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${diffConfig.class}`}
    >
      {diffConfig.label}
    </span>
  );
}
