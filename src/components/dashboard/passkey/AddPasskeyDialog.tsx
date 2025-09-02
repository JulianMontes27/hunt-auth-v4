"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { Plus } from "lucide-react";

interface AddPasskeyDialogProps {
  onPasskeyAdded: () => void;
}

export function AddPasskeyDialog({ onPasskeyAdded }: AddPasskeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [authenticatorAttachment, setAuthenticatorAttachment] = useState<
    "platform" | "cross-platform" | undefined
  >(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.passkey.addPasskey({
        name: name.trim() || undefined,
        authenticatorAttachment,
      });
      
      setOpen(false);
      setName("");
      setAuthenticatorAttachment(undefined);
      onPasskeyAdded();
    } catch (error) {
      console.error("Failed to add passkey:", error);
      alert("Failed to add passkey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Passkey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
              Create a new passkey for passwordless authentication. You can use your device&apos;s built-in authenticator or an external security key.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name (optional)
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My iPhone, YubiKey"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attachment">
                Authenticator Type
              </Label>
              <Select
                value={authenticatorAttachment}
                onValueChange={(value) =>
                  setAuthenticatorAttachment(
                    value as "platform" | "cross-platform" | undefined
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select authenticator type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">
                    Platform (Built-in, e.g., Touch ID, Windows Hello)
                  </SelectItem>
                  <SelectItem value="cross-platform">
                    Cross-platform (External, e.g., USB security key)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Passkey"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}