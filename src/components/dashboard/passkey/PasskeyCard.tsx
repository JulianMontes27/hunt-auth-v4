"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasskeyList } from "./PasskeyList";
import { AddPasskeyDialog } from "./AddPasskeyDialog";
import { Passkey } from "./types";
import { authClient } from "@/lib/auth-client";
import { Shield } from "lucide-react";

export function PasskeyCard() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPasskeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authClient.passkey.listUserPasskeys();
      if (response && 'data' in response && response.data) {
        setPasskeys(response.data);
      } else {
        setPasskeys([]);
      }
    } catch (err) {
      console.error("Failed to fetch passkeys:", err);
      setError("Failed to load passkeys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#A0A0A0]" />
            <CardTitle className="font-medium text-[#A0A0A0]">
              Passkeys
            </CardTitle>
          </div>
          <AddPasskeyDialog onPasskeyAdded={fetchPasskeys} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading passkeys...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={fetchPasskeys}
              className="text-blue-500 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Passkeys provide secure, passwordless authentication using your device&apos;s built-in biometrics or security keys.
            </div>
            <PasskeyList passkeys={passkeys} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}