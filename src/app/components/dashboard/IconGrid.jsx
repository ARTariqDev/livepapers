'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Icon from './Icon';

const COLS = 3;
const ROWS = 5;
const PER_PAGE = COLS * ROWS;

export default function IconGrid({ icons, isMobile, openWindow }) {
  const [page, setPage] = useState(0);
  const gridRef = useRef(null);
  const isAnimating = useRef(false);
  const touchStart = useRef(null);

  const pages = Math.ceil(icons.length / PER_PAGE);
  const currentIcons = icons.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const goToPage = (next, dir) => {
    if (isAnimating.current) return;
    if (next < 0 || next >= pages) return;
    isAnimating.current = true;
    const el = gridRef.current;
    gsap.to(el, {
      x: dir * -120 + '%',
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setPage(next);
        gsap.fromTo(
          el,
          { x: dir * 120 + '%', opacity: 0 },
          {
            x: '0%',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              isAnimating.current = false;
            },
          }
        );
      },
    });
  };

  useEffect(() => {
    if (!isMobile) {
      gsap.fromTo(
        '.dash-icon',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div
        className="flex-1 flex flex-col overflow-hidden"
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (diff > 50) goToPage(page + 1, 1);
          if (diff < -50) goToPage(page - 1, -1);
          touchStart.current = null;
        }}
      >
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={gridRef}
            className="grid grid-cols-3 content-start gap-y-6 gap-x-2 p-6 pt-10"
          >
            {currentIcons.map((icon, i) => (
              <div key={i} className="flex justify-center">
                <Icon {...icon} onClick={() => openWindow(icon)} />
              </div>
            ))}
          </div>
        </div>
        {pages > 1 && (
          <div className="flex justify-center gap-2 pb-4 shrink-0">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i, i > page ? 1 : -1)}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i === page ? 'bg-foreground' : 'bg-foreground/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
      <div
        style={{ height: 'calc(100vh - 80px)' }}
        className="flex flex-col flex-wrap content-start gap-y-4 gap-x-2"
      >
        {icons.map((icon, i) => (
          <div key={i} className="dash-icon">
            <Icon {...icon} onClick={() => openWindow(icon)} />
          </div>
        ))}
      </div>
    </div>
  );
}
