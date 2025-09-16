// src/shared/components/layout/PageSection.tsx
import type { PropsWithChildren } from "react";

type Variant = "default" | "wide" | "narrow";
type Props = PropsWithChildren<{ variant?: Variant; className?: string }>;

export default function PageSection({ variant = "default", className = "", children }: Props) {
  const map =
    variant === "wide"
      ? "max-w-none"
      : variant === "narrow"
      ? "max-w-xl mx-auto"
      : "max-w-7xl";
  return <section className={`${map}${className ? ` ${className}` : ""}`}>{children}</section>;
}
