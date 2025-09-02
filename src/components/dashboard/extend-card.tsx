import React from "react";
import { ArrowUpRight, MapPin, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExtendCardProps {
  title: string;
  date: {
    month: string;
    day: string;
  };
  time: string;
  location: string;
  assignee: string;
  duration: string;
  avatars: string[];
  variant?: "default" | "primary" | "secondary" | "tertiary";
}

const ExtendCard: React.FC<ExtendCardProps> = ({
  title,
  date,
  time,
  location,
  assignee,
  duration,
  avatars,
  variant = "default",
}) => {
  const getDateColorClass = () => {
    switch (variant) {
      case "primary":
        return "text-date-primary";
      case "secondary":
        return "text-date-secondary";
      case "tertiary":
        return "text-date-tertiary";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className="relative p-6 shadow-none hover:shadow-lg transition-all duration-300 group cursor-pointer">
      {/* Duration Badge */}
      <Badge
        variant="secondary"
        className="absolute top-4 right-4 text-xs bg-muted text-muted-foreground"
      >
        {duration}
      </Badge>

      {/* Date Section */}
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-sm text-muted-foreground uppercase tracking-wide">
            {date.month}
          </span>
          <span className={`text-3xl font-bold ${getDateColorClass()}`}>
            {date.day}
          </span>
        </div>

        <div className="h-28 border-r-1"></div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-card-foreground leading-tight">
            {title}
          </h3>

          <div className="border-b-1"></div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{assignee}</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-card flex items-center justify-center text-xs text-white font-medium"
                >
                  {avatar}
                </div>
              ))}
            </div>

            {/* View Details Link */}
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors group-hover:translate-x-1 duration-300">
              <span>View Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExtendCard;
