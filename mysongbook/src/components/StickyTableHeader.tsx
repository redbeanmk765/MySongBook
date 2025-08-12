// components/SheetTable/StickyTableHeader.tsx
import React from "react";
import { useStickyHeader } from "@/hooks/useStikcyHeader";

interface StickyTableHeaderProps {
  parentWidth: number;
  parentLeft: number;
  parentTop: number;
  fixedOffset: number;
  scrollLeft: number;
  children: React.ReactNode;
}

export function StickyTableHeader({
  parentWidth,
  parentLeft,
  parentTop,
  fixedOffset,
  scrollLeft,
  children,
}: StickyTableHeaderProps) {
  const {
    headerRef,
    isHeaderFixed,
    headerHeight,
    headerStyle,
    headerClassName,
  } = useStickyHeader(parentWidth, parentLeft, parentTop, fixedOffset);

  return (
    <>
      <div ref={headerRef} className={headerClassName} style={headerStyle}>
        <div className="px-6 overflow-x-hidden">
          <div style={{ display: "flex", transform: `translateX(-${scrollLeft}px)` }}>
            {children}
          </div>
        </div>
      </div>
      {isHeaderFixed && <div style={{ height: headerHeight }} />}
    </>
  );
}
