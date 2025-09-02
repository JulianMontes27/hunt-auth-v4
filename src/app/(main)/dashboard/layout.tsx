import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div
        className={`flex-1 flex flex-col transition-all duration-300 lg:ml-64`}
      >
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
