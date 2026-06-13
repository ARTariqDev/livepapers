'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function AppSwitcherCard({ w, activeWindowId, closeWindow, restoreWindow }) {
  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!swiping || startY === null) return;
    const diff = e.touches[0].clientY - startY;
    if (diff < 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!swiping) return;
    setSwiping(false);
    if (currentY < -80) {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -400,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            closeWindow(w.id);
          }
        });
      } else {
        closeWindow(w.id);
      }
    } else {
      setCurrentY(0);
    }
    setStartY(null);
  };

  const handleCardClick = () => {
    if (Math.abs(currentY) > 5) return;
    restoreWindow(w.id);
  };

  const opacity = Math.max(0.1, 1 + currentY / 250);

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
      style={{
        transform: `translateY(${currentY}px)`,
        opacity: opacity,
        transition: swiping ? 'none' : 'transform 0.2s ease-out, opacity 0.2s ease-out',
        touchAction: 'none',
      }}
      className={`flex flex-col rounded-2xl overflow-hidden border bg-surface-dim transition-colors cursor-pointer select-none ${
        w.id === activeWindowId ? 'border-foreground/40' : 'border-foreground/10'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-foreground/10">
        <span className="text-xs font-medium truncate">{w.title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(w.id);
          }}
          className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 transition-colors shrink-0 ml-2"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
        <Image src={w.iconSrc} alt={w.title} width={40} height={40} className="dark:invert opacity-60" />
        <span className="text-xs text-foreground/40">
          {w.id === activeWindowId ? 'Active' : 'Tap to switch'}
        </span>
      </div>
    </div>
  );
}
