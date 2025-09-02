"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/shared/Icon";

interface MenuItemProps {
  item: {
    label: string;
    icon: string;
    href?: string;
    submenu?: MenuItemProps["item"][];
  };
}

const MenuItem = ({ item }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive =
    (item.href && pathname === item.href) ||
    (item.submenu &&
      item.submenu.some((sub) => sub.href && pathname === sub.href));

  const content = (
    <>
      <Icon
        name={item.icon}
        className={`w-5 h-5 flex-shrink-0 ${
          isActive && mounted ? "text-white" : ""
        }`}
      />
    </>
  );

  return (
    <div className="relative group">
      {item.href ? (
        <Link
          href={item.href}
          className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors 
           ${
            isActive
              ? "text-white bg-sidebar-primary-foreground"
              : "text-[#7A7A7A] hover:text-white hover:bg-sidebar-primary-foreground"
          }`}
        >
          {content}
        </Link>
      ) : (
        <button
          onClick={() => hasSubmenu && setIsOpen(!isOpen)}
          className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive
              ? "text-white bg-sidebar-primary-foreground"
              : "text-[#7A7A7A] hover:text-white hover:bg-sidebar-primary-foreground"
          }`}        >
          {content}
        </button>
      )}

      
      {hasSubmenu && isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {item.submenu &&
            item.submenu.map((subItem) => (
              <MenuItem
                key={subItem.label}
                item={subItem}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
