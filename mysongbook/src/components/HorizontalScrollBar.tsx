"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface HorizontalScrollbarProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function HorizontalScrollbar({ scrollRef }: HorizontalScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const draggingOffset = useRef(0);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);

  // 스크롤 상태 업데이트 함수
  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollWidth > el.clientWidth;
    setScrollLeft(el.scrollLeft);
    setMaxScrollLeft(el.scrollWidth - el.clientWidth);
    setShowScrollbar(scrollable);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScroll();

    el.addEventListener("scroll", updateScroll);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateScroll);
    });
    resizeObserver.observe(el);

    const onWindowResize = () => {
      requestAnimationFrame(updateScroll);
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      el.removeEventListener("scroll", updateScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
    };
  }, [scrollRef, updateScroll]);

  const onThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;

    if (trackRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const scrollRatio = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
      const thumbWidthPx = Math.max(
        Math.min(scrollRef.current!.clientWidth / scrollRef.current!.scrollWidth, 1) * trackRect.width,
        24
      );
      const thumbLeft = scrollRatio * (trackRect.width - thumbWidthPx);

      draggingOffset.current = e.clientX - trackRect.left - thumbLeft;
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !trackRef.current || !scrollRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();

    let posX = e.clientX - trackRect.left - draggingOffset.current;

    const thumbWidthPx = Math.max(
      Math.min(scrollRef.current.clientWidth / scrollRef.current.scrollWidth, 1) * trackRect.width,
      24
    );

    posX = Math.max(0, Math.min(posX, trackRect.width - thumbWidthPx));

    const maxThumbLeft = trackRect.width - thumbWidthPx;

    const scrollRatio = posX / maxThumbLeft;
    const newScrollLeft = scrollRatio * maxScrollLeft;

    scrollRef.current.scrollLeft = newScrollLeft;
    setScrollLeft(newScrollLeft);
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // 트랙과 뷰포트, 스크롤 너비 얻기
  const scrollEl = scrollRef.current;
  const trackEl = trackRef.current;

  const clientWidth = scrollEl?.clientWidth ?? 0;
  const scrollWidth = scrollEl?.scrollWidth ?? 1; // 0 방지
  const trackWidth = trackEl?.clientWidth ?? 300;

  const viewportRatio = Math.min(clientWidth / scrollWidth, 1);
  const thumbWidthPx = Math.max(viewportRatio * trackWidth, 24);

  const maxThumbLeft = trackWidth - thumbWidthPx;

  const scrollRatioVal = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;

  const thumbLeft = scrollRatioVal * maxThumbLeft;

  if (!showScrollbar) return null;

  return (
    <div
      ref={trackRef}
      className="opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "calc(100vw - 16px)",
        height: 16,
        backgroundColor: "rgba(255,255,255,1.0)",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      <div
        onMouseDown={onThumbMouseDown}
        className="bg-[rgba(139,139,139,1.0)] hover:bg-[rgba(99,99,99,1.0)]"
        style={{
          position: "absolute",
          left: thumbLeft,
          top: 2.5,
          width: thumbWidthPx,
          height: "60%",
          borderRadius: 8,
          userSelect: "none",
          transition: "background-color 0.15s ease-in-out",
        }}
      />
    </div>
  );
}
