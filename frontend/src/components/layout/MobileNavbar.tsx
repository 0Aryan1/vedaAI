"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "@/constants/routes";
import { useNavigationStore } from "@/store";
import { LogoMark, BellButton, NotificationsPanel, Avatar } from "./navbar-ui-clean";

interface MobileNavbarProps {
  onMenuOpen: () => void;
}

export function MobileNavbar({ onMenuOpen }: MobileNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-5 pt-5 md:hidden">
      <div className="relative flex h-20 items-center justify-between rounded-[22px] bg-white px-4 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
        <Link href={`${routes.dashboard}#home`} className="flex min-h-[72px] items-center gap-0">
          <LogoMark />
          <span className="-ml-4 text-[22px] font-bold leading-[0.95] tracking-[-0.06em] text-[#2b2d2f]">VedaAI</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative">
            <BellButton onClick={() => setNotificationsOpen(!notificationsOpen)} />
            {notificationsOpen && <NotificationsPanel onClose={() => setNotificationsOpen(false)} />}
          </div>
          <Link
            href={`${routes.dashboard}#profile`}
            aria-label="Open profile"
            className="flex size-10 items-center justify-center rounded-full"
            onClick={() => useNavigationStore.getState().setHash("#profile")}
          >
            <Avatar compact />
          </Link>
          <button
            aria-label="Open menu"
            className="flex size-9 items-center justify-center text-[#202124]"
            onClick={onMenuOpen}
          >
            <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
