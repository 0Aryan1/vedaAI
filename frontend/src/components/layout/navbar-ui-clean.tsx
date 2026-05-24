"use client";

import Link from "next/link";
import Image from "next/image";
import { useNavigationStore, useAssignmentStore } from "@/store";
import { routes } from "@/constants/routes";

export function LogoMark() {
  return (
    <Image
      src="/icons/logo.svg"
      alt="VedaAI Logo"
      width={48}
      height={48}
      className="h-11 w-11 md:h-12 md:w-12 xl:h-14 xl:w-14"
      priority
    />
  );
}

export function BellButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Open notifications"
      onClick={onClick}
      className="relative flex size-11 items-center justify-center rounded-full bg-white/70 transition hover:bg-white xl:size-12"
    >
      <span className="absolute right-2.5 top-2 size-2.5 rounded-full bg-[#ff5a2f]" />
      <Image
        src="/icons/BellIcon.svg"
        alt="Notifications"
        width={24}
        height={24}
      />
    </button>
  );
}

export function Avatar() {
  return (
    <span className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd4c4_0%,#f28b6c_44%,#1f2933_45%,#111827_100%)] text-xs font-bold text-white xl:size-12">
      JD
    </span>
  );
}

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const assignments = useAssignmentStore((state) => state.assignments);
  const completed = assignments.filter((assignment) => assignment.status === "completed").length;

  return (
    <div className="absolute right-0 top-14 z-30 w-72 rounded-[18px] bg-white p-4 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2c2c2c]">Notifications</h2>
        <button aria-label="Close notifications" className="text-[#777]" onClick={onClose}>
          x
        </button>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-[#696969]">
        <p>{assignments.length} assignment{assignments.length === 1 ? "" : "s"} in your workspace.</p>
        <p>{completed} generated paper{completed === 1 ? "" : "s"} ready to review.</p>
      </div>
    </div>
  );
}

export function ProfileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-14 z-30 w-60 rounded-[18px] bg-white p-4 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-3 border-b border-[#ececec] pb-4">
        <Avatar />
        <div>
          <p className="text-base font-bold text-[#2c2c2c]">John Doe</p>
          <p className="text-sm font-medium text-[#777]">Teacher</p>
        </div>
      </div>
      <div className="mt-3 grid gap-1">
        <Link
          className="rounded-xl px-3 py-2 text-sm font-semibold text-[#555] hover:bg-[#f2f2f2]"
          href={`${routes.dashboard}#profile`}
          onClick={() => {
            useNavigationStore.getState().setHash("#profile");
            onClose();
          }}
        >
          Profile
        </Link>
        <Link
          className="rounded-xl px-3 py-2 text-sm font-semibold text-[#555] hover:bg-[#f2f2f2]"
          href={`${routes.dashboard}#settings`}
          onClick={() => {
            useNavigationStore.getState().setHash("#settings");
            onClose();
          }}
        >
          Settings
        </Link>
      </div>
    </div>
  );
}

export function SparkleIcon() {
  return (
    <Image
      src="/icons/star.svg"
      alt="Create"
      width={22}
      height={22}
    />
  );
}

export function NavGlyph({ type }: { type: string }) {
  if (type === "sparkle") return <SparkleIcon />;

  const iconMap: { [key: string]: string } = {
    grid: "/icons/homeIcon.svg",
    group: "/icons/myGroupVector.svg",
    doc: "/icons/file-text.svg",
    book: "/icons/Book.svg",
    chart: "/icons/LibraryIcon.svg",
    calendar: "/icons/homeIcon.svg",
    settings: "/icons/Setting.svg",
  };

  const iconSrc = iconMap[type] || "/icons/homeIcon.svg";

  return (
    <Image
      src={iconSrc}
      alt={type}
      width={22}
      height={22}
    />
  );
}
