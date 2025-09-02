import React from "react";
import MenuItem from "@/components/dashboard/MenuItem";
import { navigationData } from "@/data/navigation";
import { NavigationSection } from "@/types/navigation";

export const Sidebar = () => {
  return (
    <aside
      className={`bg-sidebar-primary h-screen border-r transition-all duration-300 fixed left-0 top-0 z-10 ${"w-64"}`}
    >
      <div className="p-4 py-4 border-b h-16">
        <div className="flex items-center">
          <span className="text-xl text-[#7A7A7A] font-bold">HT</span>
        </div>
      </div>
      <nav className="mt-4 px-2 space-y-6">
        {navigationData.map((section) => (
          <div key={section.title} className="space-y-2">
            <div className="space-y-1">
              {section.items.map((item: NavigationSection["items"][0]) => (
                <MenuItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
