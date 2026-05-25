"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { assignmentApi } from "@/lib/api/assignments";
import type { Assignment } from "@/types/assignment";
import { routes } from "@/constants/routes";

function AssignmentCard({
  assignment,
  isMenuOpen,
  onMenuToggle,
  onView,
  onDelete,
}: {
  assignment: Assignment;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // close handled by parent
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const assignedOn = new Date(assignment.createdAt)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const dueDate = assignment.dueDate
    ? new Date(assignment.dueDate)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-")
    : null;

  return (
    <div className="relative rounded-2xl border border-[#e8e8e8] bg-linear-to-br from-[#f0f0f0] to-[#e8e8e8] p-5 flex flex-col justify-between min-h-30 hover:border-[#ccc] transition">
      {/* Top row: title + menu */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[#2e3033] leading-snug flex-1 font-sans">
          {assignment.title}
        </h3>

        {/* Three dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={onMenuToggle}
            className="flex size-8 items-center justify-center rounded-full text-[#999] hover:bg-[#e8e8e8] hover:text-[#2e3033] transition"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
              <button
                onClick={onView}
                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition"
              >
                View Assignment
              </button>
              <button
                onClick={onDelete}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: assigned on + due date */}
      <div className="flex items-center justify-between mt-4 text-sm font-sans">
        <span className="text-[#999]">
          <span className="font-semibold text-[#2e3033]">Assigned on</span>: {assignedOn}
        </span>

        {dueDate && (
          <span className="text-[#999]">
            <span className="font-semibold text-[#2e3033]">Due</span>: {dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    assignmentApi
      .getAll()
      .then((data) => {
        setAssignments(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setAssignments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    try {
      await assignmentApi.delete(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      setOpenMenuId(null);
    } catch {
      // Deletion failed
    }
  }

  function handleView(assignment: Assignment) {
    if (assignment.paperId) {
      router.push(routes.output(assignment.paperId));
    }
    setOpenMenuId(null);
  }

  return (
    <div className="min-h-screen text-[#2e3033] p-6">
      {/* Page heading */}
      <div className="flex items-center gap-3 mb-1">
        <span className="size-3 rounded-full bg-green-500 inline-block" />
        <h1 className="text-3xl font-extrabold tracking-tighter text-[#2e3033]">Assignments</h1>
      </div>
      <p className="text-sm font-bold uppercase tracking-wide text-[#999] mb-6 ml-6">
        Manage and create assignments for your classes.
      </p>

      {/* Filter + Search bar */}
      <div className="flex items-center justify-between gap-4 mb-6 rounded-2xl border border-[#e8e8e8] px-4 py-3">
        {/* Filter button */}
        <button className="flex items-center gap-2 text-sm text-[#999] hover:text-[#2e3033] transition">
          <svg className="size-4" fill="none" viewBox="0 0 24 24">
            <path
              d="M3 4h18M7 8h10M11 12h2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Filter By
        </button>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-full border border-[#e8e8e8] px-4 py-2 w-72">
          <svg className="size-4 text-[#999] shrink-0" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path
              d="m21 21-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#2e3033] placeholder:text-[#999] outline-none w-full"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-red-200 bg-red-50">
          <p className="text-sm font-semibold text-red-800">Failed to load assignments</p>
          <p className="text-xs text-red-700 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-medium rounded-full hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-linear-to-br from-[#f0f0f0] to-[#e8e8e8] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-[#999] py-20">
          <p className="text-lg font-medium text-[#2e3033]">No assignments found</p>
          <p className="text-sm mt-1">Create your first assignment to get started</p>
        </div>
      )}

      {/* Assignment grid — 2 columns */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              isMenuOpen={openMenuId === assignment.id}
              onMenuToggle={() =>
                setOpenMenuId(openMenuId === assignment.id ? null : assignment.id)
              }
              onView={() => handleView(assignment)}
              onDelete={() => handleDelete(assignment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
