'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import Image from 'next/image';
import Icon from '../components/dashboard/Icon';
import AppWindow from '../components/dashboard/AppWindow';

gsap.registerPlugin(Draggable);

const ICONS = [
  { src: '/icons/papers.png', alt: 'Papers',    text: 'Past Papers', href: '/pastpapers' },
  { src: '/icons/mcq.png',    alt: 'Live MCQs', text: 'Live MCQs',   href: '/live-mcqs' },
  { src: '/icons/desmos.png', alt: 'Desmos',    text: 'Desmos',      href: 'https://www.desmos.com/calculator' },
];

const COLS = 3;
const ROWS = 5;
const PER_PAGE = COLS * ROWS;
let nextId = 1;

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const gridRef = useRef(null);
  const isAnimating = useRef(false);
  const touchStart = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState(0);
  const [windows, setWindows] = useState([]);
  const [minimized, setMinimized] = useState([]);
  const [topZ, setTopZ] = useState(100);
  const [showSwitcher, setShowSwitcher] = useState(false);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') update(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [update]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile && status === 'authenticated') {
      gsap.fromTo('.dash-icon',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [isMobile, status]);

  const openWindow = (icon) => {
    const existing = windows.find(w => w.src === icon.href);
    if (existing) {
      setMinimized(prev => prev.filter(m => m !== existing.id));
      focusWindow(existing.id);
      return;
    }
    const id = nextId++;
    const z = topZ + 1;
    setTopZ(z);
    setWindows(prev => [...prev, { id, title: icon.text, src: icon.href, iconSrc: icon.src, zIndex: z }]);
  };

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setMinimized(prev => prev.filter(m => m !== id));
  };

  const minimizeWindow = (id) => setMinimized(prev => [...prev, id]);

  const focusWindow = (id) => {
    const z = topZ + 1;
    setTopZ(z);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: z } : w));
  };

  const restoreWindow = (id) => {
    setMinimized(prev => prev.filter(m => m !== id));
    focusWindow(id);
    setShowSwitcher(false);
  };

  const goToPage = (next, dir) => {
    if (isAnimating.current) return;
    if (next < 0 || next >= Math.ceil(ICONS.length / PER_PAGE)) return;
    isAnimating.current = true;
    const el = gridRef.current;
    gsap.to(el, {
      x: dir * -120 + '%', opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setPage(next);
        gsap.fromTo(el,
          { x: dir * 120 + '%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 0.3, ease: 'power2.out',
            onComplete: () => { isAnimating.current = false; } }
        );
      }
    });
  };

  if (status === 'loading' && !session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-foreground/40 font-medium tracking-wide">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const pages = Math.ceil(ICONS.length / PER_PAGE);
  const currentIcons = ICONS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const visibleWindows = windows.filter(w => !minimized.includes(w.id));
  const openSrcs = new Set(windows.map(w => w.src));

  return (
    <div className="h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">


      {isMobile ? (
        <div
          className="flex-1 flex flex-col overflow-hidden"
          onTouchStart={e => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchStart.current === null) return;
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (diff > 50)  goToPage(page + 1,  1);
            if (diff < -50) goToPage(page - 1, -1);
            touchStart.current = null;
          }}
        >
          <div className="flex-1 overflow-hidden relative">
            <div ref={gridRef} className="grid grid-cols-3 content-start gap-y-6 gap-x-2 p-6 pt-10">
              {currentIcons.map((icon, i) => (
                <div key={i} className="flex justify-center">
                  <Icon {...icon} onClick={() => openWindow(icon)} />
                </div>
              ))}
            </div>
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 pb-4">
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => goToPage(i, i > page ? 1 : -1)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === page ? 'bg-foreground' : 'bg-foreground/20'}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <div style={{ height: 'calc(100vh - 80px)' }} className="flex flex-col flex-wrap content-start gap-y-4 gap-x-2">
            {ICONS.map((icon, i) => (
              <div key={i} className="dash-icon">
                <Icon {...icon} onClick={() => openWindow(icon)} />
              </div>
            ))}
          </div>
        </div>
      )}


      {visibleWindows.map(w => (
        <AppWindow
          key={w.id}
          {...w}
          isMobile={isMobile}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={() => focusWindow(w.id)}
          onShowSwitcher={() => setShowSwitcher(true)}
        />
      ))}


      {!isMobile && (
        <div className="h-16 shrink-0 border-t border-foreground/5 bg-surface-dim flex items-center justify-between px-6">

          {/*attribution */}
          <p className="text-xs text-foreground/20">
            © {new Date().getFullYear()} LivePapers ·{' '}
            <a href="https://www.flaticon.com/free-icons/document" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/40 transition-colors">
              Icons by Freepik
            </a>
          </p>

    
          <div className="flex items-end gap-1">
            {ICONS.map((icon, i) => {
              const isOpen = openSrcs.has(icon.href);
              const win = windows.find(w => w.src === icon.href);
              const isMinimized = win && minimized.includes(win.id);

              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => openWindow(icon)}
                    title={icon.text}
                    className="w-10 h-10 rounded-xl bg-background border border-foreground/10 flex items-center justify-center hover:scale-110 transition-transform duration-150"
                  >
                    <Image src={icon.src} alt={icon.alt} width={28} height={28} className="object-contain dark:invert" />
                    {isMinimized && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-foreground/40" />
                    )}
                  </button>
                  <span className={`w-1 h-1 rounded-full transition-colors ${isOpen ? 'bg-foreground/50' : 'bg-transparent'}`} />
                </div>
              );
            })}
          </div>

          {/* Right: spacer to balance layout */}
          <div className="w-32" />
        </div>
      )}

      {/* ── Mobile app switcher ── */}
      {isMobile && showSwitcher && (
        <div className="fixed inset-0 z-[200] bg-background/95 p-6 flex flex-col">
          <p className="text-sm text-foreground/40 mb-4 text-center">Open apps</p>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-1">
            {windows.length === 0
              ? <p className="col-span-2 text-center text-foreground/30 text-sm">No open apps</p>
              : windows.map(w => (
                  <button key={w.id} onClick={() => restoreWindow(w.id)}
                    className="bg-surface-dim border border-foreground/10 rounded-xl p-4 text-left flex items-center gap-3">
                    <Image src={w.iconSrc} alt={w.title} width={32} height={32} className="dark:invert" />
                    <div>
                      <p className="text-sm font-medium">{w.title}</p>
                      <p className="text-xs text-foreground/40">{minimized.includes(w.id) ? 'Minimized' : 'Running'}</p>
                    </div>
                  </button>
                ))
            }
          </div>
          <button onClick={() => setShowSwitcher(false)} className="mt-6 text-sm text-foreground/40 text-center">Dismiss</button>
        </div>
      )}
    </div>
  );
}