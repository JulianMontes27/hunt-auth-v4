import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-border-focus",
  {
    variants: {
      variant: {
        default:
          "bg-interactive-primary text-text-inverse hover:bg-interactive-primary/90",
        secondary:
          "bg-interactive-secondary text-text-primary hover:bg-interactive-hover border border-border-primary",
        destructive:
          "bg-status-error text-text-inverse hover:bg-status-error/90",
        outline: "border border-border-primary text-text-primary hover:bg-interactive-hover",
        success: "bg-status-success text-text-inverse hover:bg-status-success/90",
        warning: "bg-status-warning text-text-inverse hover:bg-status-warning/90",
        info: "bg-status-info text-text-inverse hover:bg-status-info/90",
        glass: "glassmorphism text-text-primary backdrop-blur-glass",
        gradient: "bg-gradient-to-r from-chart-1 to-chart-2 text-text-inverse",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
