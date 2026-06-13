'use client';

import Image from 'next/image';

export default function DesktopDock({
  icons,
  windows,
  minimized,
  openWindow,
}) {
  const openSrcs = new Set(windows.map((w) => w.src));

  return (
    <div className="h-16 shrink-0 border-t border-foreground/5 bg-surface-dim flex items-center justify-between px-6 select-none">
      <p className="text-xs text-foreground/20">
        © {new Date().getFullYear()} LivePapers ·{' '}
        <a
          href="https://www.flaticon.com/free-icons/document"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground/40 transition-colors"
        >
          Icons by Freepik
        </a>
      </p>
      <div className="flex items-end gap-1">
        {icons.map((icon, i) => {
          const isOpen = openSrcs.has(icon.href);
          const win = windows.find((w) => w.src === icon.href);
          const isMinimized = win && minimized.includes(win.id);

          return (
            <div key={i} className="relative flex flex-col items-center gap-1">
              <button
                onClick={() => openWindow(icon)}
                title={icon.text}
                className="w-10 h-10 rounded-xl bg-background border border-foreground/10 flex items-center justify-center hover:scale-110 transition-transform duration-150"
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={28}
                  height={28}
                  className="object-contain dark:invert"
                />
                {isMinimized && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-foreground/40" />
                )}
              </button>
              <span
                className={`w-1 h-1 rounded-full transition-colors ${
                  isOpen ? 'bg-foreground/50' : 'bg-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="w-32" />
    </div>
  );
}
