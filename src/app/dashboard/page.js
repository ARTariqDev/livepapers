'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconGrid from '../components/dashboard/IconGrid';
import DesktopDock from '../components/dashboard/DesktopDock';
import MobileAppSwitcher from '../components/dashboard/MobileAppSwitcher';
import AppWindow from '../components/dashboard/AppWindow';

const ICONS = [
  { src: '/icons/papers.png', alt: 'Papers',    text: 'Past Papers', href: '/pastpapers' },
  { src: '/icons/mcq.png',    alt: 'Live MCQs', text: 'Live MCQs',   href: '/live-mcqs' },
  { src: '/icons/desmos.png', alt: 'Desmos',    text: 'Desmos',      href: 'https://www.desmos.com/calculator' },
  { src: '/icons/settings.png', alt: 'Settings', text: 'Settings',   href: 'settings' },
];

let nextId = 1;

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [windows, setWindows] = useState([]);
  const [minimized, setMinimized] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [topZ, setTopZ] = useState(100);
  const [showSwitcher, setShowSwitcher] = useState(false);

  // Initialize saved preferences on mount
  useEffect(() => {
    const root = document.documentElement;

    // Theme initialization
    const savedTheme = localStorage.getItem('pref-theme') || 'system';
    const applyTheme = (t) => {
      root.classList.remove('dark', 'light');
      let active = t;
      if (t === 'system') {
        active = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      root.classList.add(active);
    };
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      const current = localStorage.getItem('pref-theme') || 'system';
      if (current === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Icon size initialization
    const savedIconSize = localStorage.getItem('pref-icon-size') || 'medium';
    if (savedIconSize === 'small') {
      root.style.setProperty('--icon-size', '42px');
      root.style.setProperty('--icon-wrapper-width', '70px');
    } else if (savedIconSize === 'large') {
      root.style.setProperty('--icon-size', '64px');
      root.style.setProperty('--icon-wrapper-width', '92px');
    } else {
      root.style.setProperty('--icon-size', '52px');
      root.style.setProperty('--icon-wrapper-width', '80px');
    }

    // Font size initialization
    const savedFontSize = localStorage.getItem('pref-font-size') || 'medium';
    if (savedFontSize === 'small') {
      root.style.setProperty('--icon-font-size', '10px');
    } else if (savedFontSize === 'large') {
      root.style.setProperty('--icon-font-size', '13px');
    } else {
      root.style.setProperty('--icon-font-size', '11px');
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') update();
    };
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

  const focusWindow = (id) => {
    const z = topZ + 1;
    setTopZ(z);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w))
    );
  };

  const openWindow = (icon) => {
    const existing = windows.find((w) => w.src === icon.href);
    if (existing) {
      setMinimized((prev) => prev.filter((m) => m !== existing.id));
      focusWindow(existing.id);
      setActiveWindowId(existing.id);
      return;
    }
    const id = nextId++;
    const z = topZ + 1;
    setTopZ(z);
    setWindows((prev) => [
      ...prev,
      { id, title: icon.text, src: icon.href, iconSrc: icon.src, zIndex: z },
    ]);
    setActiveWindowId(id);
  };

  const closeWindow = (id) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      if (activeWindowId === id) {
        setActiveWindowId(
          remaining.length > 0 ? remaining[remaining.length - 1].id : null
        );
      }
      if (remaining.length === 0) {
        setShowSwitcher(false);
      }
      return remaining;
    });
    setMinimized((prev) => prev.filter((m) => m !== id));
  };

  const minimizeWindow = (id) => {
    if (isMobile) {
      setActiveWindowId(null);
    } else {
      setMinimized((prev) => [...prev, id]);
    }
  };

  const restoreWindow = (id) => {
    setMinimized((prev) => prev.filter((m) => m !== id));
    focusWindow(id);
    setActiveWindowId(id);
    setShowSwitcher(false);
  };

  if (status === 'loading' && !session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-foreground/40 font-medium tracking-wide">
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const visibleWindows = windows.filter((w) => !minimized.includes(w.id));

  return (
    <div className="h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <IconGrid icons={ICONS} isMobile={isMobile} openWindow={openWindow} />
      {(isMobile ? windows : visibleWindows).map((w) => (
        <AppWindow
          key={w.id}
          {...w}
          isMobile={isMobile}
          mobileVisible={isMobile && w.id === activeWindowId}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={() => focusWindow(w.id)}
          onShowSwitcher={() => setShowSwitcher(true)}
        />
      ))}

      {!isMobile && (
        <DesktopDock
          icons={ICONS}
          windows={windows}
          minimized={minimized}
          openWindow={openWindow}
        />
      )}

      {isMobile && showSwitcher && (
        <MobileAppSwitcher
          windows={windows}
          activeWindowId={activeWindowId}
          closeWindow={closeWindow}
          restoreWindow={restoreWindow}
          onDismiss={() => setShowSwitcher(false)}
        />
      )}
    </div>
  );
}