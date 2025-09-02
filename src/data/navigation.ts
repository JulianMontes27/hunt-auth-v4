import { NavigationSection } from "../types/navigation";

export const navigationData: NavigationSection[] = [
  {
    title: "Main",
    items: [
      { label: "Panel", icon: "layoutDashboard", href: "/dashboard" },
      { label: "Perfil", icon: "user", href: "/dashboard/profile" },
    ],
  },
];
