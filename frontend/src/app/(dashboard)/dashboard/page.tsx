"use client";

import { useNavigationStore } from "@/store";
import ProfilePage from "@/components/pages/ProfilePage";
import SettingsPage from "@/components/pages/SettingsPage";
import HomePage from "@/components/pages/HomePage";
import MyGroupsPage from "@/components/pages/MyGroupsPage";
import AIToolkitPage from "@/components/pages/AIToolkitPage";
import MyLibraryPage from "@/components/pages/MyLibraryPage";
import AssignmentsPage from "@/components/pages/AssignmentsPage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const currentHash = useNavigationStore((state) => state.currentHash);

  // Show loading until hash is initialized from the URL
  if (!currentHash) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="size-8" />
      </div>
    );
  }

  const section = currentHash.substring(1) || "home"; // Remove # and get section name

  // Render different content based on the section
  switch (section) {
    case "home":
      return <HomePage />;
    case "groups":
      return <MyGroupsPage />;
    case "assignments":
      return <AssignmentsPage />;
    case "toolkit":
      return <AIToolkitPage />;
    case "library":
      return <MyLibraryPage />;
    case "profile":
      return <ProfilePage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <HomePage />;
  }
}
