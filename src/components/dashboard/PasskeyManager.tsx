"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Shield, Smartphone, Plus, MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Passkey {
  id: string;
  name: string | null;
  deviceType: string;
  backedUp: boolean;
  createdAt: Date;
  counter: number;
}

interface PasskeyManagerProps {
  initialPasskeys: Passkey[];
}

export function PasskeyManager({ initialPasskeys }: PasskeyManagerProps) {
  const [passkeys, setPasskeys] = useState<Passkey[]>(initialPasskeys);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [isDeletingPasskey, setIsDeletingPasskey] = useState<string | null>(null);
  const [isRenamingPasskey, setIsRenamingPasskey] = useState<string | null>(null);
  const [newPasskeyName, setNewPasskeyName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const router = useRouter();

  const handleAddPasskey = async () => {
    if (!newPasskeyName.trim()) {
      toast.error("Please enter a name for your passkey");
      return;
    }

    setIsAddingPasskey(true);
    try {
      await authClient.passkey.addPasskey({
        name: newPasskeyName.trim(),
      });
      
      toast.success("Passkey added successfully!");
      setNewPasskeyName("");
      setShowAddDialog(false);
      
      // Refresh the page to show updated passkeys
      router.refresh();
    } catch (error) {
      console.error("Failed to add passkey:", error);
      toast.error("Failed to add passkey. Please try again.");
    } finally {
      setIsAddingPasskey(false);
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    setIsDeletingPasskey(passkeyId);
    try {
      await authClient.passkey.deletePasskey({
        id: passkeyId,
      });
      
      toast.success("Passkey deleted successfully!");
      
      // Remove from local state
      setPasskeys(prev => prev.filter(p => p.id !== passkeyId));
      
      // Refresh the page to ensure consistency
      router.refresh();
    } catch (error) {
      console.error("Failed to delete passkey:", error);
      toast.error("Failed to delete passkey. Please try again.");
    } finally {
      setIsDeletingPasskey(null);
    }
  };

  const handleRenamePasskey = async (passkeyId: string) => {
    if (!renameValue.trim()) {
      toast.error("Please enter a name for your passkey");
      return;
    }

    setIsRenamingPasskey(passkeyId);
    try {
      await authClient.passkey.updatePasskey({
        id: passkeyId,
        name: renameValue.trim(),
      });
      
      toast.success("Passkey renamed successfully!");
      
      // Update local state
      setPasskeys(prev => 
        prev.map(p => 
          p.id === passkeyId 
            ? { ...p, name: renameValue.trim() }
            : p
        )
      );
      
      setRenameValue("");
      setShowRenameDialog(false);
      
      // Refresh the page to ensure consistency
      router.refresh();
    } catch (error) {
      console.error("Failed to rename passkey:", error);
      toast.error("Failed to rename passkey. Please try again.");
    } finally {
      setIsRenamingPasskey(null);
    }
  };

  const openRenameDialog = (passkey: Passkey) => {
    setRenameValue(passkey.name || "");
    setIsRenamingPasskey(passkey.id);
    setShowRenameDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#A0A0A0]">Manage Passkeys</h3>
          <p className="text-sm text-muted-foreground">
            Add, rename, or remove passkeys for secure authentication
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Passkey
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#171717] border border-[#292929]">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Passkey</DialogTitle>
              <DialogDescription className="text-[#7A7A7A]">
                Give your new passkey a memorable name to help you identify it later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="passkey-name" className="text-[#A0A0A0]">
                  Passkey Name
                </Label>
                <Input
                  id="passkey-name"
                  placeholder="e.g. My iPhone, Work Laptop"
                  value={newPasskeyName}
                  onChange={(e) => setNewPasskeyName(e.target.value)}
                  className="bg-[#242424] border border-[#424242] text-white placeholder:text-[#7A7A7A]"
                  disabled={isAddingPasskey}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isAddingPasskey}
                className="bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPasskey}
                disabled={isAddingPasskey || !newPasskeyName.trim()}
                className="bg-white text-black hover:bg-gray-200"
              >
                {isAddingPasskey ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Passkey"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {passkeys.length > 0 ? (
        <div className="space-y-3">
          {passkeys.map((passkey) => (
            <div
              key={passkey.id}
              className="flex items-center justify-between p-4 rounded-lg border border-[#424242] bg-[#242424]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#1d1d1d] flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-[#7A7A7A]" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {passkey.name || "Unnamed Passkey"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Device: {passkey.deviceType}</span>
                    {passkey.backedUp && (
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                        <Shield className="h-3 w-3 mr-1" />
                        Backed Up
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Created {new Date(passkey.createdAt).toLocaleDateString()} • Used {passkey.counter} times
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-[#7A7A7A] hover:text-white hover:bg-[#1d1d1d]"
                    disabled={isDeletingPasskey === passkey.id}
                  >
                    {isDeletingPasskey === passkey.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreVertical className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1d1d1d] border border-[#424242]">
                  <DropdownMenuItem
                    onClick={() => openRenameDialog(passkey)}
                    className="text-[#7A7A7A] hover:text-white hover:bg-[#242424] cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeletePasskey(passkey.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-[#424242] rounded-lg">
          <Smartphone className="h-12 w-12 text-[#7A7A7A] mx-auto mb-4" />
          <p className="text-[#7A7A7A] mb-2">No passkeys configured</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add a passkey for faster, more secure authentication
          </p>
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="bg-[#171717] border border-[#292929]">
          <DialogHeader>
            <DialogTitle className="text-white">Rename Passkey</DialogTitle>
            <DialogDescription className="text-[#7A7A7A]">
              Update the name of your passkey to make it easier to identify.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rename-passkey" className="text-[#A0A0A0]">
                Passkey Name
              </Label>
              <Input
                id="rename-passkey"
                placeholder="Enter new name"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="bg-[#242424] border border-[#424242] text-white placeholder:text-[#7A7A7A]"
                disabled={isRenamingPasskey !== null}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRenameDialog(false);
                setRenameValue("");
                setIsRenamingPasskey(null);
              }}
              disabled={isRenamingPasskey !== null}
              className="bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => isRenamingPasskey && handleRenamePasskey(isRenamingPasskey)}
              disabled={isRenamingPasskey !== null || !renameValue.trim()}
              className="bg-white text-black hover:bg-gray-200"
            >
              {isRenamingPasskey ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}