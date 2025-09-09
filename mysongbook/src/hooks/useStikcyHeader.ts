// components/SheetTable/useStickyHeader.ts
import { useEffect, useRef, useState } from "react";

export function useStickyHeader(
  parentWidth: number,
  parentLeft: number,
  parentTop: number,
  fixedOffset: number
) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (!headerRef.current) return;
    setHeaderHeight(headerRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          const shouldBeFixed = scrollY >= parentTop - fixedOffset;
          setIsHeaderFixed(shouldBeFixed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [parentTop, fixedOffset]);

  const headerStyle: React.CSSProperties = isHeaderFixed
    ? {
        width: `calc(${parentWidth}px - 8px)`,
        left: parentLeft,
        willChange: "transform, width",
        top: 64,
      }
    : {};

  const headerClassName = isHeaderFixed
    ? "fixed z-10 bg-white pl-2 "
    : "relative";

  return { headerRef, isHeaderFixed, headerHeight, headerStyle, headerClassName };
}
