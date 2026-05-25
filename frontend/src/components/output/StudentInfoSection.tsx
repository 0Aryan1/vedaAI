interface StudentInfoSectionProps {
  gradeLevel: string;
}

export function StudentInfoSection({ gradeLevel }: StudentInfoSectionProps) {
  return (
    <div className="mb-8 space-y-2 text-sm text-gray-900">
      <div className="flex items-baseline gap-1">
        <span className="font-normal">Name:</span>
        <span className="inline-block border-b border-gray-900 w-48 ml-1" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-normal">Roll Number:</span>
        <span className="inline-block border-b border-gray-900 w-36 ml-1" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-normal">
          Class: {gradeLevel} Section:
        </span>
        <span className="inline-block border-b border-gray-900 w-24 ml-1" />
      </div>
    </div>
  );
}
