"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBar } from "@/components/shared/StatusBar";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { routes } from "@/constants/routes";
import { useJobStatus } from "@/hooks/useJobStatus";
import { formatDate } from "@/lib/utils/format";
import { useAssignmentStore } from "@/store";

export default function AssignmentDetailPage() {
  const params = useParams<{ id: string }>();
  const assignment = useAssignmentStore((state) => state.getAssignment(params.id));
  const { progress, message } = useJobStatus(params.id);

  if (!assignment) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardBody className="py-12 text-center">
          <h1 className="text-xl font-semibold text-slate-950">Assignment not found</h1>
          <p className="mt-2 text-sm text-slate-500">Create a new assignment to generate a paper.</p>
          <Link className="mt-6 inline-flex" href={routes.createAssignment}>
            <Button>Create assignment</Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Assignment detail
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">{assignment.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {assignment.subject} | {assignment.className} | Due {formatDate(assignment.dueDate)}
          </p>
        </CardHeader>
        <CardBody className="grid gap-4">
          <StatusBar progress={progress} message={message} />
          {assignment.paperId ? (
            <Link href={routes.output(assignment.paperId)}>
              <Button>View generated paper</Button>
            </Link>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
