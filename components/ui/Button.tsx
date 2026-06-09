import Link from "next/link";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
}

export function Button({
  variant = "primary",
  className = "",
  href,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/60 cursor-pointer select-none";
  const variantStyles = {
    primary: "bg-brand-indigo text-white shadow-md shadow-brand-indigo/15 hover:bg-brand-indigo/90 hover:shadow-lg hover:shadow-brand-indigo/25 hover:-translate-y-0.5",
    secondary: "border border-brand-indigo/15 bg-white/80 backdrop-blur-sm text-brand-indigo shadow-sm hover:bg-brand-indigo/5 hover:-translate-y-0.5",
    ghost: "text-brand-indigo hover:bg-brand-indigo/5",
  };
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
