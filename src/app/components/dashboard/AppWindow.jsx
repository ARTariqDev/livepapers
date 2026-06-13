'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SettingsApp from './SettingsApp';

export default function AppWindow({ id, title, src, zIndex, isMobile, mobileVisible, onClose, onMinimize, onFocus, onShowSwitcher }) {
  const windowRef = useRef(null);
  const titleBarRef = useRef(null);
  const resizeRef = useRef(null);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (isMobile) return; // mobile has no entrance animation, just appears
    gsap.fromTo(windowRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.25, ease: 'power3.out' }
    );
  }, [isMobile]);

  // Drag
  useEffect(() => {
    if (isMobile || maximized) return;
    const el = windowRef.current;
    const handle = titleBarRef.current;
    let startMouseX, startMouseY, startElTop, startElLeft;

    const onMouseDown = (e) => {
      e.preventDefault();
      startMouseX = e.clientX;
      startMouseY = e.clientY;
      startElTop  = el.offsetTop;
      startElLeft = el.offsetLeft;
      handle.style.cursor = 'grabbing';
      onFocus();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    const onMouseMove = (e) => {
      el.style.top  = (startElTop  + e.clientY - startMouseY) + 'px';
      el.style.left = (startElLeft + e.clientX - startMouseX) + 'px';
    };
    const onMouseUp = () => {
      handle.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    handle.addEventListener('mousedown', onMouseDown);
    return () => handle.removeEventListener('mousedown', onMouseDown);
  }, [isMobile, maximized, onFocus]);

  // Resize
  useEffect(() => {
    if (isMobile || maximized) return;
    const el = windowRef.current;
    const handle = resizeRef.current;
    let startX, startY, startW, startH;

    const onMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      startX = e.clientX; startY = e.clientY;
      startW = el.offsetWidth; startH = el.offsetHeight;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    const onMouseMove = (e) => {
      el.style.width  = Math.max(320, startW + e.clientX - startX) + 'px';
      el.style.height = Math.max(240, startH + e.clientY - startY) + 'px';
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    handle.addEventListener('mousedown', onMouseDown);
    return () => handle.removeEventListener('mousedown', onMouseDown);
  }, [isMobile, maximized]);

  const handleClose = () => {
    if (isMobile) { onClose(id); return; }
    gsap.to(windowRef.current, {
      scale: 0.9, opacity: 0, duration: 0.2, ease: 'power2.in',
      onComplete: () => onClose(id),
    });
  };

  const handleMinimize = () => {
    if (isMobile) { onMinimize(id); return; }
    gsap.to(windowRef.current, {
      scaleY: 0, opacity: 0, transformOrigin: 'bottom center',
      duration: 0.2, ease: 'power2.in',
      onComplete: () => onMinimize(id),
    });
  };

  const handleMaximize = () => {
    const el = windowRef.current;
    if (!maximized) {
      gsap.to(el, { top: 0, left: 0, width: '100vw', height: '100vh', borderRadius: 0, duration: 0.3, ease: 'power3.out' });
    } else {
      gsap.to(el, { width: 640, height: 480, borderRadius: 12, duration: 0.3, ease: 'power3.out' });
    }
    setMaximized(m => !m);
  };

  // Mobile — always mounted, visibility controlled by mobileVisible
  if (isMobile) {
    return (
      <div
        ref={windowRef}
        className="fixed inset-0 flex flex-col bg-background transition-opacity duration-200"
        style={{
          zIndex,
          opacity: mobileVisible ? 1 : 0,
          pointerEvents: mobileVisible ? 'auto' : 'none',
        }}
      >
        {src === 'settings' ? (
          <div className="flex-1 overflow-hidden bg-background">
            <SettingsApp />
          </div>
        ) : (
          <iframe src={src} title={title} className="flex-1 w-full border-none" />
        )}
        <div className="h-14 bg-background border-t border-foreground/10 flex items-center justify-around px-8 shrink-0">
          <button
            onClick={() => onMinimize(id)}
            className="flex flex-col items-center gap-0.5 text-foreground/50 hover:text-foreground transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
            </svg>
            <span className="text-[10px]">Home</span>
          </button>
          <button
            onClick={onShowSwitcher}
            className="flex flex-col items-center gap-0.5 text-foreground/50 hover:text-foreground transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span className="text-[10px]">Apps</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      style={{ position: 'fixed', top: '10vh', left: '15vw', width: 640, height: 480, zIndex }}
      className="flex flex-col rounded-xl overflow-hidden border border-foreground/10 bg-background"
    >
      <div
        ref={titleBarRef}
        style={{ cursor: maximized ? 'default' : 'grab' }}
        className="flex items-center gap-2 px-3 h-10 bg-surface-dim border-b border-foreground/10 select-none shrink-0"
      >
        <button onClick={handleClose}    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
        <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" />
        <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
        <span className="flex-1 text-center text-xs text-foreground/40 pointer-events-none">{title}</span>
      </div>
      {src === 'settings' ? (
        <div className="flex-1 overflow-hidden bg-background">
          <SettingsApp />
        </div>
      ) : (
        <iframe src={src} title={title} className="flex-1 w-full border-none bg-white" />
      )}
      {!maximized && (
        <div ref={resizeRef} className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-10 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-30">
            <path d="M9 1L1 9M9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}