"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface OverlayScrollbarVerticalProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function OverlayScrollbarVertical({ scrollRef }: OverlayScrollbarVerticalProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const draggingOffset = useRef(0);

  const [scrollTop, setScrollTop] = useState(0);
  const [maxScrollTop, setMaxScrollTop] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [trackHeight, setTrackHeight] = useState(0);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight > el.clientHeight;
    setScrollTop(el.scrollTop);
    setMaxScrollTop(el.scrollHeight - el.clientHeight + 16);
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

  useEffect(() => {
    const trackElement = trackRef.current;
    if (!trackElement) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setTrackHeight(entry.contentRect.height);
    });
    observer.observe(trackElement);
    return () => observer.disconnect();
  }, [showScrollbar]);

  const onThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;

    if (trackRef.current && scrollRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
      const thumbHeightPx = Math.max(
        Math.min(scrollRef.current.clientHeight / scrollRef.current.scrollHeight, 1) * trackRect.height,
        24
      );
      const thumbTop = scrollRatio * (trackRect.height - thumbHeightPx);
      draggingOffset.current = e.clientY - trackRect.top - thumbTop;
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !trackRef.current || !scrollRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    let posY = e.clientY - trackRect.top - draggingOffset.current;
    const thumbHeightPx = Math.max(
      Math.min(scrollRef.current.clientHeight / scrollRef.current.scrollHeight, 1) * trackRect.height,
      24
    );
    posY = Math.max(0, Math.min(posY, trackRect.height - thumbHeightPx));
    const maxThumbTop = trackRect.height - thumbHeightPx;
    const scrollRatioVal = maxThumbTop > 0 ? posY / maxThumbTop : 0;
    scrollRef.current.scrollTop = scrollRatioVal * maxScrollTop;
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const scrollEl = scrollRef.current;
  const clientHeight = scrollEl?.clientHeight ?? 0;
  const scrollHeight = scrollEl?.scrollHeight ?? 1;
  const viewportRatio = Math.min(clientHeight / scrollHeight, 1);
  const thumbHeightPx = Math.max(viewportRatio * trackHeight, 24);
  const maxThumbTop = trackHeight - thumbHeightPx;
  const scrollRatioVal = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
  const thumbTop = scrollRatioVal * maxThumbTop + 4;

  if (!showScrollbar) return null;

  return (
    <div
      ref={trackRef}
      className="opacity-100 hover:opacity-100 transition-opacity duration-200 ease-in-out"
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        height: "calc(100vh - 79px)",
        width: 16,
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      <div
        onMouseDown={onThumbMouseDown}
        className="bg-[rgba(139,139,139,1.0)] hover:bg-[rgba(99,99,99,1.0)]"
        style={{
          position: "absolute",
          top: thumbTop,
          left: 2.5,
          height: thumbHeightPx,
          width: "60%",
          borderRadius: 8,
          userSelect: "none",
          cursor: "pointer",
          transition: "background-color 0.15s ease-in-out",
        }}
      />
    </div>
  );
}