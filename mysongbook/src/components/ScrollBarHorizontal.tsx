"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play } from 'lucide-react';


interface ScrollBarHorizontalProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  step?: number; // 화살표 클릭 시 이동할 거리
}

export function ScrollBarHorizontal({ scrollRef, step = 100 }: ScrollBarHorizontalProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const draggingOffset = useRef(0);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

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

    const onWindowResize = () => requestAnimationFrame(updateScroll);
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
      if (entry) setTrackWidth(entry.contentRect.width);
    });
    observer.observe(trackElement);
    return () => observer.disconnect();
  }, [showScrollbar]);

  const onThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;

    if (trackRef.current && scrollRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const scrollRatio = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
      const thumbWidthPx = Math.max(
        Math.min(scrollRef.current.clientWidth / scrollRef.current.scrollWidth, 1) * trackRect.width,
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
    const scrollRatio = maxThumbLeft > 0 ? posX / maxThumbLeft : 0;
    scrollRef.current.scrollLeft = scrollRatio * maxScrollLeft;
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const scrollEl = scrollRef.current;
  const clientWidth = scrollEl?.clientWidth ?? 0;
  const scrollWidth = scrollEl?.scrollWidth ?? 1;
  const viewportRatio = Math.min(clientWidth / scrollWidth, 1);
  const thumbWidthPx = Math.max(viewportRatio * trackWidth, 24);
  const maxThumbLeft = trackWidth - thumbWidthPx;
  const scrollRatioVal = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
  const thumbLeft = scrollRatioVal * maxThumbLeft;

  const scrollByStep = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const newScroll = scrollRef.current.scrollLeft + (direction === "left" ? -step : step);
    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  if (!showScrollbar) return null;

  return (
    <div
      ref={trackRef}
      className="transition-opacity duration-200 ease-in-out"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "calc(100vw - 12px)",
        height: 16,

        borderRadius: 10,
        zIndex: 9999,
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
      }}
    >
      {/* 왼쪽 화살표 */}
      <div
        onClick={() => scrollByStep("left")}
        className="cursor-pointer select-none w-[8px] h-[8px] top-[-100px] text-gray-600 hover:text-gray-800"
        style={{}}
      >
        ◀
      </div>

      {/* thumb */}
      <div
        onMouseDown={onThumbMouseDown}
        className="bg-gray-500 hover:bg-gray-700"
        style={{
          position: "absolute",
          left: thumbLeft,
          top: 3.5,
          width: thumbWidthPx,
          height: "55%",
          borderRadius: 8,  
          cursor: "pointer",
          transition: "background-color 0.15s ease-in-out",
        }}
      />

      {/* 오른쪽 화살표 */}
      <Play
        onClick={() => scrollByStep("right")}
        className="cursor-pointer select-none w-[12px] h-[12px] text-gray-600 hover:text-gray-800 fill-gray-500 hover:fill-gray-700"
        style={{ position: "absolute", right: 2, top: 1.5 }}
      />
    </div>
  );
}
