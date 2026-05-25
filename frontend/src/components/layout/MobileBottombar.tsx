"use client";

import Link from "next/link";
import { routes } from "@/constants/routes";
import { useNavigationStore } from "@/store";
import { NavGlyph } from "./navbar-ui-clean";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const items: NavItem[] = [
  { label: "Home", href: `${routes.dashboard}#home`, icon: "grid" },
  { label: "Assignments", href: `${routes.dashboard}#assignments`, icon: "calendar" },
  { label: "Library", href: `${routes.dashboard}#library`, icon: "doc" },
  { label: "AI Toolkit", href: `${routes.dashboard}#toolkit`, icon: "sparkle" },
];

export function MobileBottombar() {
  const currentHash = useNavigationStore((state) => state.currentHash);

  return (
    <nav className="fixed inset-x-3 bottom-5 z-20 grid h-[88px] grid-cols-4 items-center rounded-[30px] bg-[#171818] px-3 text-center shadow-[0_30px_110px_rgba(0,0,0,0.32)] md:hidden">
      {items.map((item) => {
        const itemHash = item.href.split("#")[1];
        const isActive = currentHash === `#${itemHash}`;

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => useNavigationStore.getState().setHash(`#${itemHash}`)}
            className={`grid h-full min-w-0 place-content-center justify-items-center gap-1 px-1 text-[12px] font-bold leading-none ${
              isActive ? "text-white" : "text-[#5f5f5f]"
            }`}
          >
            <NavGlyph type={item.icon} />
            <span className="block max-w-full whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
