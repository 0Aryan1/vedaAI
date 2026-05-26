"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/constants/routes";
import { NavGlyph } from "./navbar-ui-clean";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const items: NavItem[] = [
  { label: "Home", href: routes.dashboard, icon: "grid" },
  { label: "Assignments", href: routes.assignments, icon: "calendar" },
  { label: "Library", href: routes.library, icon: "doc" },
  { label: "AI Toolkit", href: routes.toolkit, icon: "sparkle" },
];

export function MobileBottombar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-5 bottom-5 z-20 grid h-24 grid-cols-4 items-center rounded-[30px] bg-[#171818] px-4 text-center shadow-[0_30px_110px_rgba(0,0,0,0.32)] md:hidden">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`grid justify-items-center gap-1 text-[14px] font-bold ${
              isActive ? "text-white" : "text-[#5f5f5f]"
            }`}
          >
            <NavGlyph type={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
