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
    <nav className="fixed inset-x-5 bottom-5 z-20 grid h-28.5 grid-cols-4 items-center rounded-[34px] bg-[#171818] px-5 text-center shadow-[0_30px_110px_rgba(0,0,0,0.32)] md:hidden">
      {items.map((item) => {
        const itemHash = item.href.split("#")[1];
        const isActive = currentHash === `#${itemHash}`;

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => useNavigationStore.getState().setHash(`#${itemHash}`)}
            className={`grid justify-items-center gap-1 text-[16px] font-bold ${
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
