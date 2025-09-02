"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { MapPin, Clock, Shield, Users } from "lucide-react";

interface UserDetailsSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: User["status"]) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Away":
      return "bg-yellow-100 text-yellow-800";
    case "Unassigned":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function UserDetailsSheet({
  user,
  open,
  onOpenChange,
}: UserDetailsSheetProps) {
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{user.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.location}</span>
                <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                <span className="text-sm">{user.timezone}</span>
                <Badge className={`ml-2 ${getStatusColor(user.status)}`}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="permissions">
              Access and permissions
            </TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                Public profile
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">
                    Full name
                  </span>
                  <span className="col-span-2 text-sm">{user.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="col-span-2 text-sm">{user.email}</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">
                    Job title
                  </span>
                  <span className="col-span-2 text-sm">{user.jobTitle}</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">Teams</span>
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {user.teams.map((team, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {team}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="col-span-2 text-sm">{user.role}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                Agent attributes
              </h3>

              <div className="space-y-4">
                {user.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 items-center"
                  >
                    <span className="text-sm text-muted-foreground">
                      {skill.name}
                    </span>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{skill.level}</span>
                    </div>
                  </div>
                ))}

                {Object.entries(user.attributes).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className="col-span-2 text-sm font-medium text-green-600">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                Access and permissions content would go here
              </span>
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                Conversations content would go here
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
