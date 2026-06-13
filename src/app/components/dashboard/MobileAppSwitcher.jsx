'use client';

import AppSwitcherCard from './AppSwitcherCard';

export default function MobileAppSwitcher({
  windows,
  activeWindowId,
  closeWindow,
  restoreWindow,
  onDismiss,
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
      <div className="pt-10 pb-4 text-center shrink-0">
        <p className="text-sm text-foreground/40 font-medium">
          {windows.length} app{windows.length !== 1 ? 's' : ''} running
        </p>
        <p className="text-[11px] text-foreground/30 mt-1 italic">
          Tip: Swipe up on an app card to close it
        </p>
      </div>

      {windows.length === 0 ? (
        <p className="flex-1 flex items-center justify-center text-foreground/30 text-sm">No open apps</p>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 grid grid-cols-2 gap-4 content-start pb-6">
          {windows.map((w) => (
            <AppSwitcherCard
              key={w.id}
              w={w}
              activeWindowId={activeWindowId}
              closeWindow={closeWindow}
              restoreWindow={restoreWindow}
            />
          ))}
        </div>
      )}

      <button
        onClick={onDismiss}
        className="py-6 text-sm text-foreground/40 text-center shrink-0 border-t border-foreground/5 bg-background active:bg-surface-dim transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
}
