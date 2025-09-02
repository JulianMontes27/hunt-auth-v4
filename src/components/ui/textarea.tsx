import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-lg text-sm transition-all duration-200 placeholder:text-text-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      variant: {
        default: "border border-border-secondary bg-surface-secondary px-3 py-2 hover:border-border-focus focus:border-border-focus focus:ring-1 focus:ring-border-focus",
        glass: "glassmorphism-input px-3 py-2",
        ghost: "bg-transparent border-b border-border-primary px-0 py-2 hover:border-border-focus focus:border-border-focus rounded-none",
        filled: "bg-interactive-secondary border border-transparent px-3 py-2 hover:bg-interactive-hover focus:bg-surface-secondary focus:border-border-focus focus:ring-1 focus:ring-border-focus",
      },
      size: {
        sm: "min-h-[60px] text-xs",
        default: "min-h-[80px]",
        lg: "min-h-[120px] text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
