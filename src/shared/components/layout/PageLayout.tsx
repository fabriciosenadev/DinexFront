// src/shared/components/layout/PageLayout.tsx
import type { PropsWithChildren } from "react";

type Variant = "default" | "wide" | "narrow";

type Props = PropsWithChildren<{ variant?: Variant; className?: string }>;

export default function PageLayout({ variant = "default", className = "", children }: Props) {
    const base = "w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8";
    const variantClass =
        variant === "wide"
            ? "max-w-none"          // ocupa toda a largura útil
            : variant === "narrow"
                ? "max-w-xl mx-auto"    // centralizado (Import)
                : "max-w-7xl";          // alinhado à esquerda

    return <div className={`${base} ${variantClass}${className ? ` ${className}` : ""}`}>{children}</div>;
}
