"use client";

import { Passkey } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PasskeyListProps {
  passkeys: Passkey[];
}

export function PasskeyList({ passkeys }: PasskeyListProps) {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (passkeys.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          No passkeys found. Add your first passkey to enable passwordless authentication.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Device Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Backed Up</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {passkeys.map((passkey) => (
            <TableRow key={passkey.id}>
              <TableCell>
                <span className="font-medium">
                  {passkey.name || "Unnamed Passkey"}
                </span>
              </TableCell>
              <TableCell>
                <span className="capitalize">{passkey.deviceType}</span>
              </TableCell>
              <TableCell>{formatDate(passkey.createdAt)}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    passkey.backedUp
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {passkey.backedUp ? "Yes" : "No"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}