"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex h-8 w-14 items-center rounded-full bg-muted p-1">
        <div className="h-6 w-6 rounded-full bg-background shadow-sm transition-transform duration-200" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-14 items-center rounded-full cursor-pointer  p-1 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      aria-label="Toggle theme"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 rounded-full bg-[#292929] opacity-0 transition-opacity duration-300 dark:opacity-100" />

      {/* Sliding toggle */}
      <div
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-slate-700" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </div>

      {/* Background icons */}
      <Sun className="absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white opacity-70 transition-opacity duration-300 dark:opacity-30" />
      <Moon className="absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white opacity-30 transition-opacity duration-300 dark:opacity-70" />

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
