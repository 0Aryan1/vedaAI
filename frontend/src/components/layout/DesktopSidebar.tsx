"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/constants/routes";
import { LogoMark, Avatar, NavGlyph, SparkleIcon } from "./navbar-ui-clean";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: routes.dashboard, icon: "grid" },
  { label: "My Groups", href: routes.groups, icon: "group" },
  { label: "Assignments", href: routes.assignments, icon: "doc" },
  { label: "AI Teacher's Toolkit", href: routes.toolkit, icon: "book" },
  { label: "My Library", href: routes.library, icon: "chart" },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden fixed left-5 top-5 bottom-5 w-[320px] shrink-0 flex-col rounded-[20px] bg-white px-6 py-6 shadow-[0_30px_110px_rgba(0,0,0,0.16)] lg:w-[340px] xl:w-[360px] md:flex">
      <Link 
        href={routes.dashboard} 
        className="flex min-h-[72px] items-center gap-0"
      >
        <LogoMark />
        <span className="-ml-4 text-[31px] font-bold leading-[0.95] tracking-[-0.06em] text-[#2b2d2f] xl:text-[34px]">VedaAI</span>
      </Link>

      <Link
        href={routes.createAssignment}
        className="mt-14 flex h-14 items-center justify-center gap-3 rounded-[36px] border-[4px] border-[#f07a56] bg-[#202123] text-lg font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:bg-[#111] xl:mt-16 xl:h-15 xl:text-xl"
      >
        <SparkleIcon />
        Create Assignment
      </Link>

      <nav className="mt-14 grid gap-2 text-[17px] font-medium text-[#858585] xl:mt-16 xl:text-[19px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-11 items-center gap-3 rounded-[10px] px-4 transition hover:bg-[#f3f3f3] xl:h-12 ${
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
          href={routes.settings} 
          className="flex h-11 items-center gap-3 px-4 text-[17px] font-medium text-[#858585] xl:text-[19px]" 
        >
          <NavGlyph type="settings" />
          Settings
        </Link>
        <Link 
          href={routes.profile} 
          className="mt-4 flex items-center gap-3 rounded-[18px] bg-[#eeeeee] p-3 transition hover:bg-[#e7e7e7]" 
        >
          <Avatar />
          <div>
            <p className="text-[17px] font-bold text-[#2c2c2c] xl:text-[18px]">Delhi Public School</p>
            <p className="mt-1 text-sm font-medium text-[#6f6f6f]">Bokaro Steel City</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
