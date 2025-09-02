"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User } from "better-auth";

const AVATAR_GALLERY_UPLOADTHING = [
  "https://tprbcin26j.ufs.sh/f/zkshbEfecNgAw6SH2xyK6V3UMhoQNBSjOW24tfwXxn8CFzYE",
  "https://tprbcin26j.ufs.sh/f/zkshbEfecNgANp8JxpjQOmCBawZyoFqWv7DiuSpUkYtJbnr0",
  "https://db.hunt-tickets.com/storage/v1/object/public/default/avatars/avatar1.jpg",
  "https://db.hunt-tickets.com/storage/v1/object/public/default/avatars/avatar2.jpg",
  "https://db.hunt-tickets.com/storage/v1/object/public/default/avatars/avatar3.jpg",
  "https://db.hunt-tickets.com/storage/v1/object/public/default/avatars/avatar4.jpg",
  "https://db.hunt-tickets.com/storage/v1/object/public/default/avatars/avatar5.jpg",
  "https://db.hunt-tickets.com/storage/v1/object/public/default/avatars/avatar6.jpg",
];

const CustomizableAvatar = ({ user }: { user: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    user?.image
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleAvatarSelect = async (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) return;

    setIsUpdating(true);

    try {
      const response = await fetch("/api/user/avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: selectedAvatar,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el avatar");
      }

      // Update the user object locally
      user.image = selectedAvatar;
      toast.success("Avatar actualizado correctamente");
      setIsModalOpen(false);

      // Refresh the page to show updated avatar
      //   window.location.reload();
      router.refresh(); // Navigate to /dashboard
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar el avatar"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch("/api/user/avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el avatar");
      }

      // Update local state
      setSelectedAvatar(null);
      user.image = null;
      toast.success("Avatar eliminado correctamente");
      setIsModalOpen(false);

      // Refresh the page to show updated avatar
      //   window.location.reload();
      router.refresh(); // Navigate to /dashboard
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar el avatar"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <Avatar className="h-20 w-20">
          <AvatarImage src={selectedAvatar || ""} alt={user.name} />
          <AvatarFallback className="text-lg bg-[#242424] text-[#7A7A7A]">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {isHovered && (
          <div className="absolute bottom-0 right-0 bg-black/80 rounded-full p-1 transform translate-x-1/2 translate-y-1/2">
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Elegir Foto de Perfil</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={selectedAvatar || ""} alt={user.name} />
                <AvatarFallback className="text-2xl bg-[#242424] text-[#7A7A7A]">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Elegir de Galería
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_GALLERY_UPLOADTHING.map((avatarUrl, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedAvatar === avatarUrl
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleAvatarSelect(avatarUrl)}
                  >
                    <Avatar className="h-16 w-full">
                      <AvatarImage
                        src={avatarUrl || "/placeholder.svg"}
                        alt={`Avatar ${index + 1}`}
                      />
                      <AvatarFallback>A{index + 1}</AvatarFallback>
                    </Avatar>
                    {selectedAvatar === avatarUrl && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSaveAvatar}
                disabled={isUpdating || selectedAvatar === user.image}
                className="w-full"
              >
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
              </Button>
              {selectedAvatar && (
                <Button
                  variant="destructive"
                  onClick={handleRemoveAvatar}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? "Eliminando..." : "Eliminar Foto"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomizableAvatar;
