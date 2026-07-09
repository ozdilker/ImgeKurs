import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "gold" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-container hover:scale-[1.02] shadow-sm",
  secondary:
    "bg-gold text-primary hover:bg-gold/90 hover:scale-[1.02] font-semibold",
  gold: "bg-gold text-primary hover:bg-gold/90 font-semibold",
  ghost:
    "border border-white/80 text-white hover:bg-white/10 bg-transparent",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white bg-transparent",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
