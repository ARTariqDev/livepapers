'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

export default function Navbar() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      '.nav-header',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <header className="nav-header fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none opacity-0 translate-y-[-20px]">
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-background/70 backdrop-blur-xl border border-foreground/10 rounded-full shadow-sm">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
            LivePapers.
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-foreground/70 transition-colors px-3 py-2">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
