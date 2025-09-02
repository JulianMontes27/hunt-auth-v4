"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navigationData } from "@/data/navigation";
import { LayoutDashboard, User, Menu } from "lucide-react";

const iconMap = {
  layoutDashboard: LayoutDashboard,
  user: User,
};

export function MobileSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    console.log("[v0] handleClose called");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    console.log("[v0] Sheet onOpenChange called with:", open);
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-[#292929]"
          onClick={() => console.log("[v0] Trigger button clicked")}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-0 w-80 bg-[#171717] border-[#292929] border-r"
      >
        <SheetHeader className="px-6 py-4 border-b border-[#292929]">
          <SheetTitle className="text-xl font-bold text-white">
            Hunt Tickets
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <nav className="flex-1 px-6 py-6">
            {navigationData.map((section) => (
              <div key={section.title} className="mb-8">
                <h3 className="mb-4 text-sm font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items
                    .filter((item) => item.href)
                    .map((item) => {
                      const IconComponent =
                        iconMap[item.icon as keyof typeof iconMap];
                      const isActive = pathname === item.href;

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href!}
                            onClick={handleClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-[#292929] text-white border border-[#424242]"
                                : "text-[#7A7A7A] hover:text-white hover:bg-[#242424]"
                            }`}
                          >
                            {IconComponent && (
                              <IconComponent className="h-5 w-5 flex-shrink-0" />
                            )}
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="px-6 py-4 border-t border-[#292929]">
            <div className="text-xs text-[#7A7A7A] text-center">
              © 2024 Hunt Tickets
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
