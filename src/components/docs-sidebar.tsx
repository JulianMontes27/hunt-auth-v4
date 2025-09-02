"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  Code, 
  FileText, 
  Globe, 
  Settings, 
  Users,
  Home,
  Rocket
} from "lucide-react";

const navigation = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: BookOpen,
  },
  {
    title: "Components",
    href: "/docs/components",
    icon: Code,
  },
  {
    title: "API Reference",
    href: "/docs/api",
    icon: FileText,
  },
  {
    title: "Examples",
    href: "/docs/examples",
    icon: Globe,
  },
  {
    title: "Deployment",
    href: "/docs/deployment",
    icon: Rocket,
  },
  {
    title: "Contributing",
    href: "/docs/contributing",
    icon: Users,
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <div className="p-4">
      <div className="mb-6">
        <Link
          href="/docs"
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/docs"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Home className="h-4 w-4" />
          <span>Overview</span>
        </Link>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Back to App</span>
        </Link>
      </div>
    </div>
  );
} 