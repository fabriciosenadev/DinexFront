// src/shared/components/layout/TableWrapper.tsx
import type { PropsWithChildren } from "react";

export default function TableWrapper({ children }: PropsWithChildren) {
  return (
    <div className="overflow-x-auto [-webkit-overflow-scrolling:touch] overscroll-x-contain">
      {children}
    </div>
  );
}

