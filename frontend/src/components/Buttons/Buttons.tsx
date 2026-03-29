import type { FC, ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "white";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:   "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
  secondary: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20",
  white:     "bg-white text-blue-700 hover:bg-blue-50 shadow-lg",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "px-4 py-2   text-sm  font-semibold",
  md: "px-6 py-3   text-sm  font-bold",
  lg: "px-7 py-3.5 text-base font-bold",
};

const Button: FC<ButtonProps> = ({
  variant  = "primary",
  size     = "md",
  className = "",
  children,
  ...rest
}) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2 rounded-xl
      transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60
      ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}
    `}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
