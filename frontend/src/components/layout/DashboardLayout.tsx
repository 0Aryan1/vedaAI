"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";
import { MobileBottombar } from "./MobileBottombar";
import { MobileSidebar } from "./MobileSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white md:bg-[#f5f5f5]">
      
      {/* DESKTOP VIEW */}
      <div className="hidden md:block">
        {/* Desktop Sidebar - Left (Fixed) */}
        <DesktopSidebar />

        {/* Main Content Area */}
        <div className="ml-120 flex flex-col gap-6 p-6">
          {/* Desktop Navbar - Top (Fixed) */}
          <DesktopNavbar />

          {/* Main Content */}
          <main className="relative flex flex-1 flex-col rounded-[20px] px-8 py-8 pt-32">
            {children}
          </main>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden flex flex-col min-h-screen bg-white">
        {/* Mobile Navbar - Top with menu icon */}
        <MobileNavbar onMenuOpen={() => setMobileMenuOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col px-5 pt-32 pb-32">
          {children}
        </main>

        {/* Mobile Bottom Bar - Bottom navigation */}
        <MobileBottombar />

        {/* Mobile Sidebar - Slide-out menu */}
        {mobileMenuOpen && <MobileSidebar onClose={() => setMobileMenuOpen(false)} />}
      </div>
    </div>
  );
}
