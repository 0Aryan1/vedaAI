"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "@/constants/routes";
import { LogoMark, BellButton, NotificationsPanel } from "./navbar-ui-clean";

interface MobileNavbarProps {
  onMenuOpen: () => void;
}

export function MobileNavbar({ onMenuOpen }: MobileNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-5 pt-5 md:hidden">
      <div className="relative flex h-22 items-center justify-between rounded-[22px] bg-white px-5 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
        <Link href={`${routes.dashboard}#home`} className="flex items-center gap-3">
          <LogoMark />
          <span className="text-[24px] font-bold tracking-[-0.06em] text-[#2b2d2f] leading-none">VedaAI</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative">
            <BellButton onClick={() => setNotificationsOpen(!notificationsOpen)} />
            {notificationsOpen && <NotificationsPanel onClose={() => setNotificationsOpen(false)} />}
          </div>
          <button
            aria-label="Open menu"
            className="flex size-10 items-center justify-center text-[#202124]"
            onClick={onMenuOpen}
          >
            <svg aria-hidden="true" className="size-9" viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
