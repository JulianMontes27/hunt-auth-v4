import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen flex flex-col bg-background">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-xl font-bold text-white hover:text-primary transition-colors"
              >
                Hunt Tickets
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">Documentation</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content with sidebar */}
        <div className="flex flex-1 pt-16">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
              <DocsSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
