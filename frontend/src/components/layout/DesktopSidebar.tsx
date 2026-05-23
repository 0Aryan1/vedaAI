"use client";

import Link from "next/link";
import { routes } from "@/constants/routes";
import { useNavigationStore } from "@/store";
import { LogoMark, Avatar, NavGlyph, SparkleIcon } from "./navbar-ui-clean";

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

export function DesktopSidebar() {
  const currentHash = useNavigationStore((state) => state.currentHash);

  return (
    <aside className="hidden fixed left-6 top-6 bottom-6 w-108 shrink-0 flex-col rounded-[20px] bg-white px-8 py-8 shadow-[0_30px_110px_rgba(0,0,0,0.16)] md:flex">
      <Link 
        href={`${routes.dashboard}#home`} 
        className="flex items-center gap-4" 
        onClick={() => useNavigationStore.getState().setHash('#home')}
      >
        <LogoMark />
        <span className="text-[38px] font-bold tracking-[-0.06em] text-[#2b2d2f] leading-none">VedaAI</span>
      </Link>

      <Link
        href={routes.createAssignment}
        className="mt-20 flex h-18 items-center justify-center gap-4 rounded-[36px] border-[5px] border-[#f07a56] bg-[#202123] text-2xl font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:bg-[#111]"
      >
        <SparkleIcon />
        Create Assignment
      </Link>

      <nav className="mt-20 grid gap-3 text-[22px] font-medium text-[#858585]">
        {navItems.map((item) => {
          const itemHash = item.href.split("#")[1];
          const isActive = currentHash === `#${itemHash}`;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => useNavigationStore.getState().setHash(`#${itemHash}`)}
              className={`flex h-14 items-center gap-4 rounded-[10px] px-6 transition hover:bg-[#f3f3f3] ${
                isActive ? "bg-[#eeeeee] font-bold text-[#2c2c2c]" : ""
              }`}
            >
              <NavGlyph type={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link 
          href={`${routes.dashboard}#settings`} 
          className="flex h-14 items-center gap-4 px-5 text-[22px] font-medium text-[#858585]" 
          onClick={() => useNavigationStore.getState().setHash('#settings')}
        >
          <NavGlyph type="settings" />
          Settings
        </Link>
        <Link 
          href={`${routes.dashboard}#profile`} 
          className="mt-6 flex items-center gap-4 rounded-[18px] bg-[#eeeeee] p-4 transition hover:bg-[#e7e7e7]" 
          onClick={() => useNavigationStore.getState().setHash('#profile')}
        >
          <Avatar />
          <div>
            <p className="text-[22px] font-bold text-[#2c2c2c]">Delhi Public School</p>
            <p className="mt-1 text-[17px] font-medium text-[#6f6f6f]">Bokaro Steel City</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
