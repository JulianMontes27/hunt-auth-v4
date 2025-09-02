"use client";

// import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "./MobileSidebar";

export const TopBar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <header className="h-16 px-6 py-3 flex items-center justify-between border-b bg-background sticky top-0 w-full z-10">
      <div className="flex items-center gap-4">
        <MobileSidebar />
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {/* User dropdown menu */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer border border-border rounded-lg focus:outline-none">
                {isPending ? (
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                ) : (
                  // <Image
                  //   src={session?.user.}
                  //   alt={session?.user?.name || "Username"}
                  //   width={32}
                  //   height={32}
                  //   className="w-8 h-8 rounded-full"
                  // />
                  <></>
                )}
                <span className="hidden sm:block text-sm font-medium text-foreground truncate max-w-[120px]">
                  {isPending
                    ? "Cargando..."
                    : session?.user?.name || "Invitado"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Facturación</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive cursor-pointer"
              >
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
