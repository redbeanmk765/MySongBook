"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUIStore } from "@/stores/uiStore";
import { SheetTable } from "./SheetTable";
import { Button } from "@/components/ui/button";
import { PartialBlock } from "@blocknote/core";
import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(() => import("./BlockNoteEditor"), { ssr: false });

export function SheetView() {
  const isAdmin = useUIStore((state) => state.isAdmin);
  const mode = useUIStore((state) => state.mode);
  const setMode = useUIStore((state) => state.setMode);

  const [noteBlocks, setNoteBlocks] = useState<PartialBlock[]>([
    {
      type: "paragraph",
      content: "여기에 자유롭게 메모를 남겨보세요!",
    },
  ]);

  const isEditable = isAdmin && mode === "edit";

  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);

  // 트랙 Ref
  const trackRef = useRef<HTMLDivElement>(null);
  // 드래그 상태
  const dragging = useRef(false);

  // 스크롤 상태 업데이트 함수
  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollWidth > el.clientWidth;
    setScrollLeft(el.scrollLeft);
    setMaxScrollLeft(el.scrollWidth - el.clientWidth);
    setShowScrollbar(scrollable);
  }, []);

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
  }, [updateScroll]);

  // 트랙 클릭 혹은 드래그 이벤트 처리
  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !scrollRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;

    // 클릭 위치 비율 (0 ~ 1)
    const ratio = clickX / trackRect.width;
    const newScrollLeft = ratio * maxScrollLeft;

    scrollRef.current.scrollLeft = newScrollLeft;
    setScrollLeft(newScrollLeft);
  };

  const onThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !trackRef.current || !scrollRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    let posX = e.clientX - trackRect.left;

    // 범위 제한
    if (posX < 0) posX = 0;
    if (posX > trackRect.width) posX = trackRect.width;

    const ratio = posX / trackRect.width;
    const newScrollLeft = ratio * maxScrollLeft;

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

  // 뷰포트 비율에 따른 thumb 너비 (최소 24px 유지)
  const viewportRatio = Math.min(clientWidth / scrollWidth, 1);
  const thumbWidthPx = Math.max(viewportRatio * trackWidth, 24);

  // thumb가 이동할 수 있는 범위 (트랙 너비 - thumb 너비)
  const maxThumbLeft = trackWidth - thumbWidthPx;

  // 현재 스크롤 비율 (0 ~ 1)
  const scrollRatio = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;

  // thumb 위치 계산
  const thumbLeft = scrollRatio * maxThumbLeft;

  return (
    <div className="container mx-auto py-10">
      {/* 상단 에디터 */}
      <div className="mb-8 p-6 rounded-lg bg-white shadow-md">
        <BlockNoteEditor content={noteBlocks} onChange={setNoteBlocks} editable={isEditable} />
      </div>

      {/* 제목 및 모드 전환 버튼 */}
      <div className="flex justify-between items-center mb-4 px-6">
        <h1 className="text-2xl font-bold">My Song Book</h1>
        {isAdmin && (
          <Button onClick={() => setMode(mode === "edit" ? "read" : "edit")}>
            {mode === "edit" ? "읽기 모드로 전환" : "편집 모드로 전환"}
          </Button>
        )}
      </div>

      {/* 테이블이 들어가는 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="relative bg-white rounded-lg shadow-md overflow-x-auto pl-8 pr-8 mx-6"
        style={{ height: "auto" }}
      >
        <SheetTable isEditable={isEditable} />
      </div>

      {/* 하단 커스텀 스크롤바 */}
      {showScrollbar && (
        <div
          ref={trackRef}
          onClick={onTrackClick}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            height: 20,
            backgroundColor: "#d1d5db", // Tailwind gray-300
            cursor: "pointer",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          <div
            onMouseDown={onThumbMouseDown}
            style={{
              position: "absolute",
              left: thumbLeft,
              top: 0,
              width: thumbWidthPx,
              height: "100%",
              backgroundColor: "#3b82f6", // Tailwind blue-500
              borderRadius: 8,
              boxShadow: "0 0 6px rgba(59, 130, 246, 0.6)",
              cursor: "grab",
              userSelect: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
