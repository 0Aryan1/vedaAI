"use client";

import Link from "next/link";
import { routes } from "@/constants/routes";
import { useNavigationStore } from "@/store";
import { LogoMark, SparkleIcon, NavGlyph, Avatar } from "./navbar-ui-clean";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: `${routes.dashboard}#home`, icon: "grid" },
  { label: "My Groups", href: `${routes.dashboard}#groups`, icon: "group" },
  { label: "Assignments", href: `${routes.dashboard}#assignments`, icon: "doc" },
  { label: "AI Teacher's Toolkit", href: `${routes.dashboard}#toolkit`, icon: "book" },
  { label: "My Library", href: `${routes.dashboard}#library`, icon: "chart" },
];

interface MobileSidebarProps {
  onClose: () => void;
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const currentHash = useNavigationStore((state) => state.currentHash);

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden">
      <div className="ml-auto flex h-full w-[82%] max-w-85 flex-col bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <Link
            href={`${routes.dashboard}#home`}
            className="flex min-h-[72px] items-center gap-0"
            onClick={() => {
              useNavigationStore.getState().setHash('#home');
              onClose();
            }}
          >
            <LogoMark />
            <span className="-ml-4 text-[24px] font-bold leading-[0.95] tracking-[-0.06em] text-[#2b2d2f]">
              VedaAI
            </span>
          </Link>
          <button
            aria-label="Close menu"
            className="text-2xl text-[#333] hover:text-black transition"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <Link
          href={routes.createAssignment}
          onClick={onClose}
          className="mt-7 flex h-12 items-center justify-center gap-3 rounded-full bg-[#171819] text-base font-bold text-white hover:bg-[#2a2b2c] transition"
        >
          <SparkleIcon />
          Create Assignment
        </Link>

        <nav className="mt-7 grid gap-2 text-base font-semibold text-[#666]">
          {navItems.map((item) => {
            const itemHash = item.href.split("#")[1];
            const isActive = currentHash === `#${itemHash}`;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  useNavigationStore.getState().setHash(`#${itemHash}`);
                  onClose();
                }}
                className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 transition ${
                  isActive ? "bg-[#eeeeee] text-[#2c2c2c]" : ""
                }`}
              >
                <NavGlyph type={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <Link 
            href={`${routes.dashboard}#settings`}
            onClick={() => {
              useNavigationStore.getState().setHash('#settings');
              onClose();
            }}
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-base font-semibold text-[#666] transition hover:bg-[#f3f3f3]"
          >
            <NavGlyph type="settings" />
            Settings
          </Link>
          <Link 
            href={`${routes.dashboard}#profile`}
            onClick={() => {
              useNavigationStore.getState().setHash('#profile');
              onClose();
            }}
            className="mt-4 flex items-center gap-3 rounded-2xl bg-[#eeeeee] p-3 transition hover:bg-[#e7e7e7]"
          >
            <Avatar />
            <div>
              <p className="text-base font-bold text-[#2c2c2c]">Delhi Public School</p>
              <p className="mt-1 text-sm font-medium text-[#6f6f6f]">Bokaro Steel City</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
