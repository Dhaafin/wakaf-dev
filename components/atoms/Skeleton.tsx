import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
}

/**
 * Komponen Atom Skeleton serbaguna dengan efek shimmer Tailwind (@apply .skeleton).
 * Mendukung varian rect (persegi rounded), circle (lingkaran), dan text (baris tipis).
 */
export function Skeleton({
  variant = "rect",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    rect: "rounded-xl",
    circle: "rounded-full",
    text: "rounded-md h-4",
  };

  const inlineStyle = {
    width,
    height,
    ...style,
  };

  return (
    <div
      aria-hidden="true"
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={inlineStyle}
      {...props}
    />
  );
}
