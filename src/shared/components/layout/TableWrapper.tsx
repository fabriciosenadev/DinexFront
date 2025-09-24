// src/shared/components/layout/TableWrapper.tsx
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ className?: string }>;

export default function TableWrapper({ children, className }: Props) {
  const base = "overflow-x-auto [-webkit-overflow-scrolling:touch] overscroll-x-contain";
  return <div className={`${base}${className ? ` ${className}` : ""}`}>{children}</div>;
}

