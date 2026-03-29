import type { FC, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`
      group bg-white dark:bg-slate-900
      rounded-2xl border border-slate-100 dark:border-slate-800
      shadow-sm hover:shadow-xl hover:shadow-blue-500/10
      hover:-translate-y-2 transition-all duration-300
      ${className}
    `}
  >
    {children}
  </div>
);

export default Card;
