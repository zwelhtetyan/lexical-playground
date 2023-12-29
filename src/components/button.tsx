import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default function IconButton({
  active,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`bg-slate-100 p-2 hover:bg-slate-50 transition-colors ${className} ${
        active ? "bg-white" : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
