// components/SheetTable/useStickyHeader.ts
import { useEffect, useRef, useState } from "react";

export function useStickyHeader(
  parentWidth: number,
  parentLeft: number,
  parentTop: number,
  fixedOffset: number,
  scrollContainer: React.RefObject<HTMLDivElement>,
  triggerRef: React.RefObject<HTMLDivElement>,
) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (!headerRef.current) return;
    setHeaderHeight(headerRef.current.offsetHeight);
  }, []);

  // useEffect(() => {
  //   let ticking = false;

  //   const onScroll = () => {
  //     if (!ticking) {
  //       window.requestAnimationFrame(() => {
  //         const scrollY = window.scrollY || window.pageYOffset;
  //         const shouldBeFixed = scrollY >= parentTop - fixedOffset;
  //         setIsHeaderFixed(shouldBeFixed);
  //         ticking = false;
  //       });
  //       ticking = true;
  //     }
  //   };

  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, [parentTop, fixedOffset]);

  useEffect(() => {
    if (!triggerRef.current || !scrollContainer.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeaderFixed(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [scrollContainer, triggerRef]);

  const headerStyle: React.CSSProperties = isHeaderFixed
    ? {
        width: `calc(${parentWidth}px - 8px)`,
        left: parentLeft,
        willChange: "transform, width",
        top: fixedOffset ,
      }
    : {};

  const headerClassName = isHeaderFixed
    ? "fixed z-10 bg-white pl-2 "
    : "relative";

  return { headerRef, isHeaderFixed, headerHeight, headerStyle, headerClassName };
}
