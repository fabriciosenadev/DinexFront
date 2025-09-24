// src/shared/components/layout/PageSection.tsx
import type { PropsWithChildren } from "react";

type Variant = "default" | "wide" | "narrow";
type Props = PropsWithChildren<{ variant?: Variant; className?: string }>;

export default function PageSection({ variant = "default", className = "", children }: Props) {
  const base = "block w-full min-w-0"; // ⬅️ importante em containers aninhados
  const map =
    variant === "narrow"
      ? "max-w-full sm:max-w-xl sm:mx-auto"
      : "w-full";

  return <section className={`${base} ${map}${className ? ` ${className}` : ""}`}>{children}</section>;
}
