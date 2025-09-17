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
  scrollContainer: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLDivElement>;
}

export function StickyTableHeader({
  parentWidth,
  parentLeft,
  parentTop,
  fixedOffset,
  scrollLeft,
  children,
  scrollContainer,
  triggerRef,
}: StickyTableHeaderProps) {
  const {
    headerRef,
    isHeaderFixed,
    headerHeight,
    headerStyle,
    headerClassName,
  } = useStickyHeader(parentWidth, parentLeft, parentTop, fixedOffset, scrollContainer, triggerRef);

  return (
    <>
      <div ref={headerRef} className={headerClassName} style={headerStyle}>
        <div className="flex overflow-x-hidden border-b border-gray-300 ">{children}</div>
      </div>
      {isHeaderFixed && <div style={{ height: headerHeight }} />}
    </>
  );
}
