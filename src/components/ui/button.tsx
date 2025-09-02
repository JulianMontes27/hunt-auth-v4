import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-interactive-primary text-text-inverse hover:bg-interactive-primary/90 shadow-sm hover:shadow-md",
        destructive:
          "bg-status-error text-text-inverse hover:bg-status-error/90 shadow-sm",
        outline:
          "border border-border-primary bg-transparent text-text-primary hover:bg-interactive-hover hover:border-border-focus",
        secondary:
          "bg-interactive-secondary text-text-primary border border-border-primary hover:bg-interactive-hover glassmorphism",
        ghost: "text-text-primary hover:bg-interactive-hover hover:text-text-primary",
        link: "text-text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
        glass: "backdrop-blur-glass bg-surface-elevated/20 border border-border-primary text-text-primary hover:bg-surface-elevated/40 shadow-glass",
        gradient: "bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-text-inverse hover:shadow-xl shadow-lg animate-gradient-shift",
        glow: "bg-interactive-primary text-text-inverse shadow-lg hover:shadow-xl transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
      effect: {
        none: "",
        float: "hover-float",
        glow: "transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
        pulse: "hover:animate-pulse",
        bounce: "hover:animate-bounce",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    effect,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, effect, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {leftIcon && !loading && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
