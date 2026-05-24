"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import { useNavigationStore, useUIStore } from "@/store";
import { BellButton, Avatar, NotificationsPanel, ProfileMenu } from "./navbar-ui-clean";

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

export function DesktopNavbar() {
  const router = useRouter();
  const { openDropdown, setOpenDropdown } = useUIStore();
  const currentHash = useNavigationStore((state) => state.currentHash);

  // Get the current section title based on hash
  const getSectionTitle = () => {
    const hashValue = currentHash.substring(1); // Remove the # character
    const item = navItems.find(nav => nav.href.includes(`#${hashValue}`));
    return item ? item.label : "Dashboard";
  };

  // Hide back button on home page
  const showBackButton = currentHash !== "#home";

  return (
    <header className="hidden fixed left-[365px] right-5 top-5 z-10 h-16 items-center justify-between rounded-[20px] bg-white/88 px-6 shadow-[0_30px_110px_rgba(0,0,0,0.16)] md:flex lg:left-[385px] xl:left-[405px]">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <button
            aria-label="Go back"
            className="flex size-11 items-center justify-center rounded-full bg-white text-[#2a2b2d] transition hover:bg-[#f5f5f5]"
            onClick={() => router.back()}
          >
            <Image 
              src="/icons/Arrow_Left.svg" 
              alt="Back arrow" 
              width={24} 
              height={24}
              className="h-5 w-5"
            />
          </button>
        ) : null}
        <div className="flex items-center gap-2">
          <Image 
            src="/icons/homeIcon.svg" 
            alt="Home icon" 
            width={20} 
            height={20}
            className="h-5 w-5"
          />
          <span className="text-xl font-semibold text-[#a4a4a4] xl:text-[22px]">{getSectionTitle()}</span>
        </div>
      </div>
      <div className="relative flex items-center gap-4">
        <BellButton onClick={() => setOpenDropdown(openDropdown === "notifications" ? null : "notifications")} />
        <Avatar />
        <button
          className="flex items-center gap-2 text-lg font-bold text-[#2a2b2d] xl:text-xl"
          onClick={() => setOpenDropdown(openDropdown === "profile" ? null : "profile")}
        >
          <span>John Doe</span>
          <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
          </svg>
        </button>
        {openDropdown === "notifications" ? <NotificationsPanel onClose={() => setOpenDropdown(null)} /> : null}
        {openDropdown === "profile" ? <ProfileMenu onClose={() => setOpenDropdown(null)} /> : null}
      </div>
    </header>
  );
}
