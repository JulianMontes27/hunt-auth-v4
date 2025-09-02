import { NavigationSection } from "../types/navigation";

export const navigationData: NavigationSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: "layoutDashboard", href: "/dashboard" },
      { label: "Profile", icon: "user", href: "/dashboard/profile" },
    ],
  },
];
